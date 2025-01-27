//Reference from Poe, Doubao
document.addEventListener('DOMContentLoaded', function () {
    function showCategory(category) {
        const products = document.querySelectorAll('.product');
        products.forEach(product => {
            if (product.classList.contains(category)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
        document.getElementById('currentCategory').textContent = category.charAt(0).toUpperCase() + category.slice(1);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    if (category) {
        showCategory(category);
    } else {
        showCategory('vegetables');
    }

    const categoryLinks = document.querySelectorAll('.category-list a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const category = this.textContent.toLowerCase();
            showCategory(category);
        });
    });

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productName = this.dataset.productName;
            const price = parseFloat(this.dataset.price);

            if (productName && price) {
                addToCart(productName, price);
            }
        });
    });
});