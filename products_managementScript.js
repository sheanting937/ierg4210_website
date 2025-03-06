//Reference from Poe, Doubao
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await populateCategories();
        await displayProducts();
    } catch (error) {
        console.error('Error initializing product management:', error);
        alert('An error occurred while initializing product management.');
    }

    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const productId = document.getElementById('productId').value;
            const catid = document.getElementById('catid').value;
            const name = document.getElementById('name').value;
            const price = document.getElementById('price').value;
            const description = document.getElementById('description').value;
            const image = document.getElementById('image').files[0];

            if (!catid || !name || !price || isNaN(price) || !description) {
                alert('Please fill in all required fields.');
                return;
            }

            const formData = new FormData();
            formData.append('catid', catid);
            formData.append('name', name);
            formData.append('price', price);
            formData.append('description', description);
            if (image) {
                formData.append('image', image);
            }

            let url = 'http://localhost:3000/products';
            let method = 'POST';
            if (productId) {
                url = `http://localhost:3000/products/${productId}`;
                method = 'PUT';
            }

            try {
                const response = await fetch(url, {
                    method: method,
                    body: formData
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error processing product:', errorData.error);
                    alert(`Error processing product: ${errorData.error}`);
                    return;
                }
                const data = await response.json();
                alert(data.message);
                addProductForm.reset();
                document.getElementById('productId').value = '';
                document.getElementById('submitButton').textContent = 'Add Product';
                await displayProducts();
            } catch (error) {
                console.error('Unexpected error while processing product:', error);
                alert('An unexpected error occurred while processing the product.');
            }
        });
    }
});

async function populateCategories() {
    try {
        const response = await fetch('http://localhost:3000/categories');
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching categories:', errorData.error);
            alert(`Error fetching categories: ${errorData.error}`);
            return;
        }
        const categories = await response.json();
        const catidSelect = document.getElementById('catid');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.catid;
            option.textContent = category.name;
            catidSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Unexpected error while populating categories:', error);
        alert('An unexpected error occurred while populating categories.');
    }
}

async function displayProducts() {
    try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching products:', errorData.error);
            alert(`Error fetching products: ${errorData.error}`);
            return;
        }
        const products = await response.json();
        const productListDiv = document.getElementById('productList');
        productListDiv.innerHTML = '<h2>Existing Products</h2>';
        if (products.length === 0) {
            productListDiv.innerHTML += '<p>No products found.</p>';
        } else {
            const ul = document.createElement('ul');
            products.forEach(product => {
                const li = document.createElement('li');
                li.textContent = `${product.name} - $${product.price}`;

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', async () => {
                    await populateEditForm(product);
                });
                li.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', async () => {
                    try {
                        const deleteResponse = await fetch(`http://localhost:3000/products/${product.pid}`, {
                            method: 'DELETE'
                        });
                        if (!deleteResponse.ok) {
                            const deleteErrorData = await deleteResponse.json();
                            console.error('Error deleting product:', deleteErrorData.error);
                            alert(`Error deleting product: ${deleteErrorData.error}`);
                            return;
                        }
                        const deleteData = await deleteResponse.json();
                        alert(deleteData.message);
                        await displayProducts();
                    } catch (error) {
                        console.error('Unexpected error while deleting product:', error);
                        alert('An unexpected error occurred while deleting the product.');
                    }
                });
                li.appendChild(deleteButton);

                ul.appendChild(li);
            });
            productListDiv.appendChild(ul);
        }
    } catch (error) {
        console.error('Unexpected error in displayProducts function:', error);
        alert('An unexpected error occurred while fetching products.');
    }
}

async function populateEditForm(product) {
    document.getElementById('productId').value = product.pid;
    document.getElementById('catid').value = product.catid;
    document.getElementById('name').value = product.name;
    document.getElementById('price').value = product.price;
    document.getElementById('description').value = product.description;
    document.getElementById('submitButton').textContent = 'Update Product';
}