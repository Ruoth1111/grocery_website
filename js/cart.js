// DOM elements
const cartItemsContainer = document.getElementById('cart-items');
const emptyCartMessage = document.getElementById('empty-cart');
const cartTotals = document.getElementById('cart-totals');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
});

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Load cart items
function loadCart() {
    const cartItems = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    const cartTotalsSection = document.getElementById('cart-totals');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    const cart = getCart();
    
    // Check if cart is empty
    if (cart.length === 0) {
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'flex';
        }
        if (cartTotalsSection) {
            cartTotalsSection.style.display = 'none';
        }
        return;
    }
    
    // Cart is not empty, hide empty cart message and show totals
    if (emptyCartMessage) {
        emptyCartMessage.style.display = 'none';
    }
    if (cartTotalsSection) {
        cartTotalsSection.style.display = 'block';
    }
    
    // Clear existing cart items
    // Remove all child elements except the empty cart message
    while (cartItems.firstChild) {
        if (cartItems.firstChild.id === 'empty-cart') {
            break;
        }
        cartItems.removeChild(cartItems.firstChild);
    }
    
    // Add each cart item to the DOM
    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.dataset.id = item.id;
        
        cartItemElement.innerHTML = `
            <div class="item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <div class="item-price">$${parseFloat(item.price).toFixed(2)}</div>
                <div class="item-quantity">
                    <button class="quantity-btn decrease">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" readonly>
                    <button class="quantity-btn increase">+</button>
                </div>
            </div>
            <div class="item-total">$${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
            <button class="remove-item" data-id="${item.id}">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        
        // Insert before the empty cart message
        cartItems.insertBefore(cartItemElement, emptyCartMessage);
    });
    
    // Update totals
    updateCartTotals();
    
    // Add event listeners to quantity buttons and remove buttons
    addCartEventListeners();
}

// Update cart totals
function updateCartTotals() {
    const cart = getCart();
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
    
    // Fixed shipping cost
    const shipping = 4.99;
    
    // Calculate tax (assume 8%)
    const tax = subtotal * 0.08;
    
    // Calculate total
    const total = subtotal + shipping + tax;
    
    // Update DOM
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
}

// Update cart count
function updateCartCount() {
    const cart = getCart();
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        
        if (cartCount > 0) {
            cartCountElement.style.display = 'flex';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

// Add event listeners for cart actions
function addCartEventListeners() {
    // Add event listeners to increase/decrease buttons
    const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
    const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
    const removeButtons = document.querySelectorAll('.remove-item');
    
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const itemId = cartItem.dataset.id;
            updateItemQuantity(itemId, 1);
        });
    });
    
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const itemId = cartItem.dataset.id;
            updateItemQuantity(itemId, -1);
        });
    });
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.dataset.id;
            removeItem(itemId);
        });
    });
}

// Update item quantity
function updateItemQuantity(itemId, change) {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        
        // Ensure quantity doesn't go below 1
        if (cart[itemIndex].quantity < 1) {
            cart[itemIndex].quantity = 1;
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Reload cart
        loadCart();
        
        // Update cart count in navbar
        updateCartCount();
    }
}

// Remove item from cart
function removeItem(itemId) {
    let cart = getCart();
    
    // Remove item from cart
    cart = cart.filter(item => item.id !== itemId);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Reload cart
    loadCart();
    
    // Update cart count in navbar
    updateCartCount();
}
