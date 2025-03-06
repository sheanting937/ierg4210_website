//Reference from Poe, Doubao
const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

app.use(express.json());
app.use(cors());
app.use(express.static('.'));

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'sheanting937',
    database: 'ierg4210_shopping'
});

const uploadDir = path.join(__dirname, 'images');
const thumbnailDir = path.join(uploadDir, 'thumbnails');
const largeImageDir = path.join(uploadDir, 'large');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(thumbnailDir)) {
    fs.mkdirSync(thumbnailDir);
}
if (!fs.existsSync(largeImageDir)) {
    fs.mkdirSync(largeImageDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extname = path.extname(file.originalname);
        cb(null, uniqueSuffix + extname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|gif|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only jpg, gif, and png files are allowed.'));
        }
    }
});

app.get('/categories', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT catid, name FROM categories');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching categories from database:', error);
        res.status(500).json({ error: 'Internal server error while fetching categories' });
    }
});

app.get('/categories/:catid', async (req, res) => {
    try {
        const catid = parseInt(req.params.catid);
        const [rows] = await pool.execute('SELECT catid, name FROM categories WHERE catid =?', [catid]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching category from database:', error);
        res.status(500).json({ error: 'Internal server error while fetching category' });
    }
});

app.post('/categories', async (req, res) => {
    try {
        const { categoryName } = req.body;
        if (!categoryName) {
            return res.status(400).json({ error: 'Category name is required' });
        }
        const [result] = await pool.execute('INSERT INTO categories (name) VALUES (?)', [categoryName]);
        res.json({ message: 'Category added successfully', id: result.insertId });
    } catch (error) {
        console.error('Error adding category to database:', error);
        res.status(500).json({ error: 'Internal server error while adding category' });
    }
});

app.put('/categories/:catid', async (req, res) => {
    try {
        const catid = parseInt(req.params.catid);
        const { categoryName } = req.body;
        if (isNaN(catid) || !categoryName) {
            return res.status(400).json({ error: 'Invalid category ID or category name' });
        }
        const [result] = await pool.execute('UPDATE categories SET name =? WHERE catid =?', [categoryName, catid]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category updated successfully' });
    } catch (error) {
        console.error('Error updating category in database:', error);
        res.status(500).json({ error: 'Internal server error while updating category' });
    }
});

app.delete('/categories/:catid', async (req, res) => {
    try {
        const catid = parseInt(req.params.catid);
        if (isNaN(catid)) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }
        const [result] = await pool.execute('DELETE FROM categories WHERE catid =?', [catid]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category from database:', error);
        res.status(500).json({ error: 'Internal server error while deleting category' });
    }
});

app.get('/products', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT pid, catid, name, price, description, thumbnail, large_image FROM products');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products from database:', error);
        res.status(500).json({ error: 'Internal server error while fetching products' });
    }
});

app.get('/products/:catid', async (req, res) => {
    try {
        const catid = parseInt(req.params.catid);
        const [rows] = await pool.execute('SELECT pid, catid, name, price, description, thumbnail, large_image FROM products WHERE catid =?', [catid]);
        if (rows.length === 0) {
            console.log('No products found for this catid');
        }
        res.json(rows);
    } catch (error) {
        console.error('Error fetching products from database:', error);
        res.status(500).json({ error: 'Internal server error while fetching products' });
    }
});

app.get('/product/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const [rows] = await pool.execute('SELECT p.pid, p.catid, p.name, p.price, p.description, p.thumbnail, p.large_image, c.name as category_name FROM products p JOIN categories c ON p.catid = c.catid WHERE p.pid =?', [pid]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching product details from database:', error);
        res.status(500).json({ error: 'Internal server error while fetching product details' });
    }
});

app.post('/products', upload.single('image'), async (req, res) => {
    try {
        const { catid, name, price, description } = req.body;
        let thumbnail = null;
        let largeImage = null;
        if (req.file) {
            const originalImagePath = req.file.path;
            const filename = req.file.filename;
            const thumbnailPath = path.join(thumbnailDir, filename);
            const largeImagePath = path.join(largeImageDir, filename);

            await sharp(originalImagePath)
                .resize(200, 200)
                .toFile(thumbnailPath);

            await sharp(originalImagePath)
                .resize(800, 800)
                .toFile(largeImagePath);

            thumbnail = `/images/thumbnails/${filename}`;
            largeImage = `/images/large/${filename}`;
        }

        const parsedCatid = parseInt(catid);
        const parsedPrice = parseFloat(price);

        if (isNaN(parsedCatid) || !name || isNaN(parsedPrice) || !description) {
            return res.status(400).json({ error: 'Invalid input. Please provide valid category, name, price, and description.' });
        }

        const [result] = await pool.execute('INSERT INTO products (catid, name, price, description, thumbnail, large_image) VALUES (?,?,?,?,?,?)', [parsedCatid, name, parsedPrice, description, thumbnail, largeImage]);
        res.json({ message: 'Product added successfully', id: result.insertId });
    } catch (error) {
        console.error('Error adding product to database:', error);
        res.status(500).json({ error: 'Internal server error while adding product' });
    }
});

app.put('/products/:pid', upload.single('image'), async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        const { catid, name, price, description } = req.body;
        let thumbnail = null;
        let largeImage = null;
        if (req.file) {
            const originalImagePath = req.file.path;
            const filename = req.file.filename;
            const thumbnailPath = path.join(thumbnailDir, filename);
            const largeImagePath = path.join(largeImageDir, filename);

            await sharp(originalImagePath)
                .resize(200, 200)
                .toFile(thumbnailPath);

            await sharp(originalImagePath)
                .resize(800, 800)
                .toFile(largeImagePath);

            thumbnail = `/images/thumbnails/${filename}`;
            largeImage = `/images/large/${filename}`;
        }

        const parsedCatid = parseInt(catid);
        const parsedPrice = parseFloat(price);

        if (isNaN(pid) || isNaN(parsedCatid) || !name || isNaN(parsedPrice) || !description) {
            return res.status(400).json({ error: 'Invalid product ID or input data' });
        }

        let updateQuery = 'UPDATE products SET catid =?, name =?, price =?, description =?';
        let values = [parsedCatid, name, parsedPrice, description];
        if (thumbnail && largeImage) {
            updateQuery += ', thumbnail =?, large_image =?';
            values.push(thumbnail, largeImage);
        }
        updateQuery += ' WHERE pid =?';
        values.push(pid);

        const [result] = await pool.execute(updateQuery, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product in database:', error);
        res.status(500).json({ error: 'Internal server error while updating product' });
    }
});

app.delete('/products/:pid', async (req, res) => {
    try {
        const pid = parseInt(req.params.pid);
        if (isNaN(pid)) {
            return res.status(400).json({ error: 'Invalid product ID' });
        }
        const [result] = await pool.execute('DELETE FROM products WHERE pid =?', [pid]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product from database:', error);
        res.status(500).json({ error: 'Internal server error while deleting product' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});