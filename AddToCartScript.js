//Reference from Poe, Doubao
const cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartItems = document.getElementById('cartItems');
const checkoutButton = document.getElementById('checkoutButton');
const totalPriceElement = document.getElementById('totalPrice');
const shoppingListContent = document.querySelector('.shopping-list-content');

function toggleShoppingList() {
    shoppingListContent.classList.toggle('show');
}

async function addToCart(pid) {
    try {
        const response = await fetch(`http://localhost:3000/product/${pid}`);
        if (!response.ok) {
            throw new Error('Failed to fetch product information');
        }
        const product = await response.json();

        const existingItem = cart.find(item => item.pid === pid);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ pid: pid, name: product.name, price: product.price, quantity: 1 });
        }
        saveCartToLocalStorage();
        updateCart();
    } catch (error) {
        console.error('Error adding product to cart:', error);
    }
}

function saveCartToLocalStorage() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
}

function updateCart() {
    console.log('Updating cart...');
    cartItems.innerHTML = '';
    let totalPrice = 0;
    cart.forEach(item => {
        console.log('Processing item:', item);
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name}</span>
            <button onclick="decreaseQuantity('${item.pid}')">-</button>
            <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.pid}', this.value)">
            <button onclick="increaseQuantity('${item.pid}')">+</button>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
            <button onclick="removeItem('${item.pid}')">Remove</button>
        `;
        cartItems.appendChild(li);
        totalPrice += item.price * item.quantity;
    });
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

function updateQuantity(pid, newQuantity) {
    const item = cart.find(item => item.pid === pid);
    if (item) {
        item.quantity = parseInt(newQuantity);
        saveCartToLocalStorage();
        updateCart();
    }
}

function decreaseQuantity(pid) {
    const item = cart.find(item => item.pid === pid);
    if (item && item.quantity > 1) {
        item.quantity--;
        saveCartToLocalStorage();
        updateCart();
    }
}

function increaseQuantity(pid) {
    const item = cart.find(item => item.pid === pid);
    if (item) {
        item.quantity++;
        saveCartToLocalStorage();
        updateCart();
    }
}

function removeItem(pid) {
    const index = cart.findIndex(item => item.pid === pid);
    if (index !== -1) {
        cart.splice(index, 1);
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

const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const pid = button.dataset.pid;
        addToCart(pid);
    });
});

updateCart();

document.addEventListener('DOMContentLoaded', function () {
    shoppingListContent.classList.add('show');
});