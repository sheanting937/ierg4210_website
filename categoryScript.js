//Reference from Poe, Doubao
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const catid = urlParams.get('catid');
    if (!catid) {
        console.error('Category ID is missing in the URL');
        return;
    }
    if (!catid || !/^\d+$/.test(catid)) {
        console.error('Invalid catid in URL.');
        return;
    }

    try {
        const categoryResponse = await fetch(`http://localhost:3000/categories/${catid}`);
        if (!categoryResponse.ok) {
            const errorText = await categoryResponse.text();
            console.error('Error fetching category details:', errorText);
            return;
        }
        const category = await categoryResponse.json();

        const currentCategoryElement = document.getElementById('currentCategory');
        currentCategoryElement.textContent = category.name;
        currentCategoryElement.href = `category.html?catid=${catid}`;

        const productList = document.getElementById('productList');
        const productResponse = await fetch(`http://localhost:3000/products/${catid}`);
        if (!productResponse.ok) {
            const errorText = await productResponse.text();
            console.error('Error fetching products:', errorText);
            return;
        }
        const products = await productResponse.json();

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');

            const imgLink = document.createElement('a');
            imgLink.href = `product.html?pid=${product.pid}`;
            const img = document.createElement('img');
            img.src = `http://localhost:3000${product.thumbnail}`;
            img.alt = product.name;
            imgLink.appendChild(img);
            productDiv.appendChild(imgLink);

            const nameLink = document.createElement('a');
            nameLink.href = `product.html?pid=${product.pid}`;
            const h2 = document.createElement('h2');
            h2.textContent = product.name;
            nameLink.appendChild(h2);
            productDiv.appendChild(nameLink);

            const p = document.createElement('p');
            p.textContent = `Price: $${product.price}`;

            const button = document.createElement('button');
            button.classList.add('add-to-cart');
            button.dataset.productName = product.name;
            button.dataset.price = product.price;
            button.dataset.pid = product.pid;
            button.textContent = 'Add to Cart';

            productDiv.appendChild(p);
            productDiv.appendChild(button);
            productList.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Unexpected error:', error);
    }

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const pid = button.dataset.pid;
            if (pid) {
                addToCart(pid);
            }
        });
    });
});