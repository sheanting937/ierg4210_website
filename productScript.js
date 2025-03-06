//Reference from Poe, Doubao
document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const pid = urlParams.get('pid');
    if (!pid) {
        console.error('Product ID is missing in the URL');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/product/${pid}`);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching product details:', errorData.error);
            return;
        }
        const product = await response.json();

        const productImage = document.querySelector('.product-image');
        const productName = document.querySelector('.product-name');
        const productDescription = document.querySelector('.product-description');
        const productPrice = document.querySelector('.product-price');
        const categoryLink = document.getElementById('categoryLink');
        const navproductName = document.getElementById('productName');
        const addToCartButton = document.querySelector('.add-to-cart');

        productImage.src = `http://localhost:3000${product.large_image}`;
        productName.textContent = product.name;
        productDescription.textContent = product.description;
        productPrice.textContent = `Price: $${product.price}`;
        addToCartButton.dataset.pid = product.pid;
        categoryLink.textContent = product.category_name;
        categoryLink.href = `category.html?catid=${product.catid}`;
        navproductName.textContent = product.name;

        categoryLink.addEventListener('click', function (e) {
            e.preventDefault();
            const catid = product.catid;
            const url = `category.html?catid=${catid}`;
            console.log('Jump to URL:', url);
            window.location.href = url;
        });

        if (addToCartButton) {
            addToCartButton.addEventListener('click', function () {
                if (product.name && product.price) {
                    addToCart(product.name, product.price);
                }
            });
        }
    } catch (error) {
        console.error('Unexpected error while fetching product details:', error);
    }

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.dataset.productName;
            const price = parseFloat(button.dataset.price);
            if (productName && price) {
                addToCart(productName, price);
            }
        });
    });
});