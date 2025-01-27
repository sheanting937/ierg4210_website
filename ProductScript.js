//Reference from Poe, Doubao
// Reference from WikiPedia
document.addEventListener('DOMContentLoaded', function () {
    function getProductDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const product = urlParams.get('product');
        const category = urlParams.get('category');
        const productImage = document.querySelector('.product-image');
        const productName = document.querySelector('.product-name');
        const productDescription = document.querySelector('.product-description');
        const productPrice = document.querySelector('.product-price');
        const categoryLink = document.getElementById('categoryLink');
        const navproductName = document.getElementById('productName');
        const addToCartButton = document.querySelector('.add-to-cart');

        let price;

        if (product === 'carrot') {
            productImage.src = 'Carrot.jpg';
            productName.textContent = 'Carrot';
            productDescription.textContent = 'Description: The carrot is a root vegetable, typically orange in colour, though heirloom variants including purple, black, red, white, and yellow cultivars exist, all of which are domesticated forms of the wild carrot, Daucus carota, native to Europe and Southwestern Asia. The plant probably originated in Iran and was originally cultivated for its leaves and seeds.';
            productPrice.textContent = 'Price: $10';
            categoryLink.textContent = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Vegetables";
            navproductName.textContent = 'Carrot';
            price = 10;
        } else if (product === 'tomato') {
            productImage.src = 'Tomato.jpg';
            productName.textContent = 'Tomato';
            productDescription.textContent = 'The tomato is a plant whose fruit is an edible berry that is eaten as a vegetable. The tomato is a member of the nightshade family that includes tobacco, potato, and chili peppers. It originated from and was domesticated in western South America. It was introduced to the Old World by the Spanish in the Columbian exchange in the 16th century.';
            productPrice.textContent = 'Price: $15';
            categoryLink.textContent = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Vegetables";
            navproductName.textContent = 'Tomato';
            price = 15;
        } else if (product === 'apple') {
            productImage.src = 'Apple.jpg';
            productName.textContent = 'Apple';
            productDescription.textContent = 'Description: An apple is a round, edible fruit produced by an apple tree. Apple trees are cultivated worldwide and are the most widely grown species in the genus Malus. The tree originated in Central Asia, where its wild ancestor, Malus sieversii, is still found. Apples have been grown for thousands of years in Eurasia and were introduced to North America by European colonists. Apples have religious and mythological significance in many cultures, including Norse, Greek, and European Christian tradition.';
            productPrice.textContent = 'Price: $10';
            categoryLink.textContent = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Fruits";
            navproductName.textContent = 'Apple';
            price = 10;
        } else if (product === 'banana') {
            productImage.src = 'Banana.jpg';
            productName.textContent = 'Banana';
            productDescription.textContent = 'Description: A banana is an elongated, edible fruit - botanically a berry - produced by several kinds of large treelike herbaceous flowering plants in the genus Musa. In some countries, cooking bananas are called plantains, distinguishing them from dessert bananas. The fruit is variable in size, color and firmness, but is usually elongated and curved, with soft flesh rich in starch covered with a peel, which may have a variety of colors when ripe. It grows upward in clusters near the top of the plant. Almost all modern edible seedless (parthenocarp) cultivated bananas come from two wild species - Musa acuminata and Musa balbisiana, or hybrids of them.';
            productPrice.textContent = 'Price: $5';
            categoryLink.textContent = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Fruits";
            navproductName.textContent = 'Banana';
            price = 5;
        } else if (product === 'chicken') {
            productImage.src = 'Chicken.jpg';
            productName.textContent = 'Chicken';
            productDescription.textContent = 'Description: The chicken is a large and round short-winged bird, domesticated from the red junglefowl of Southeast Asia around 8,000 years ago. Most chickens are raised for food, providing meat and eggs; others are kept as pets or for cockfighting.';
            productPrice.textContent = 'Price: $25';
            categoryLink.textContent = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Meats";
            navproductName.textContent = 'Chicken';
            price = 25;
        } else if (product === 'pork') {
            productImage.src = 'Pork.jpg';
            productName.textContent = 'Pork';
            productDescription.textContent = 'Description: Pork is the culinary name for the meat of the pig. It is the most commonly consumed meat worldwide, with evidence of pig husbandry dating back to 5000 BCE.';
            productPrice.textContent = 'Price: $30';
            categoryLink.textContent = category ? category.charAt(0).toUpperCase() + category.slice(1) : "Meats";
            navproductName.textContent = 'Pork';
            price = 30;
        }

        categoryLink.addEventListener('click', function (e) {
            e.preventDefault();
            const category = this.textContent.toLowerCase();
            window.location.href = `index.html?category=${category}`;
        });

        if (addToCartButton) {
            addToCartButton.addEventListener('click', function () {
                if (product && price) {
                    addToCart(product, price);
                }
            });
        }
    }

    getProductDetails();
});