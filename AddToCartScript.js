//Reference from Poe, Doubao
const cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartItems = document.getElementById('cartItems');
const checkoutButton = document.getElementById('checkoutButton');
const totalPriceElement = document.getElementById('totalPrice');

function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: productName, price: price, quantity: 1 });
    }
    saveCartToLocalStorage();
    updateCart();
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCart() {
    cartItems.innerHTML = '';
    let totalPrice = 0;
    cart.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name}</span>
            <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.name}', this.value)">
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        cartItems.appendChild(li);
        totalPrice += item.price * item.quantity;
    });
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

function updateQuantity(productName, newQuantity) {
    const item = cart.find(item => item.name === productName);
    if (item) {
        item.quantity = parseInt(newQuantity);
        saveCartToLocalStorage();
        updateCart();
    }
}

checkoutButton.addEventListener('click', function () {
    alert('Submitting list to Payment Gateway...');
    cart.length = 0;
    saveCartToLocalStorage();
    updateCart();
});

updateCart();