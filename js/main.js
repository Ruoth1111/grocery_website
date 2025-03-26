// DOM elements
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart
    initializeCart();
    
    // Check for logged in user and update UI
    checkLoginStatus();
    
    // Add event listeners for adding products to cart
    setupAddToCartButtons();
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Toggle hamburger icon
    const bars = hamburger.querySelectorAll('.bar');
    if (hamburger.classList.contains('active')) {
        bars[0].style.transform = 'translateY(8px) rotate(45deg)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.hamburger')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        
        // Reset hamburger icon
        const bars = hamburger.querySelectorAll('.bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
    }
});

// Initialize cart from localStorage
function initializeCart() {
    const cart = getCart();
    updateCartCount(cart.length);
}

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('cart') || localStorage.getItem('grosfreshCart');
    return cart ? JSON.parse(cart) : [];
}

// Update cart count
function updateCartCount(count) {
    // Find cart count element by id or class
    const cartCountElement = document.getElementById('cart-count') || document.querySelector('.cart-count');
    
    if (cartCountElement) {
        cartCountElement.textContent = count;
        
        // Animate count change
        cartCountElement.classList.add('pulse');
        setTimeout(() => {
            cartCountElement.classList.remove('pulse');
        }, 300);
        
        // Show/hide based on count
        if (count > 0) {
            cartCountElement.style.display = 'flex';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

// Setup add to cart buttons
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get product info from closest product card
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent.split(' ')[0];
            const productImage = productCard.querySelector('img').src;
            
            // Create product object
            const product = {
                id: productCard.dataset.id || generateProductId(productName),
                name: productName,
                price: productPrice.replace('$', ''),
                image: productImage,
                quantity: 1
            };
            
            // Add to cart
            addToCart(product);
            
            // Show confirmation message
            showAddedToCartMessage(productName);
        });
    });
}

// Generate a simple product ID based on name
function generateProductId(name) {
    return name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000);
}

// Add product to cart
function addToCart(product) {
    const cart = getCart();
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex > -1) {
        // Update quantity if product exists
        cart[existingProductIndex].quantity += 1;
    } else {
        // Add new product to cart
        cart.push(product);
    }
    
    // Save cart to localStorage under a standard key
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount(cart.reduce((total, item) => total + item.quantity, 0));
}

// Show added to cart message
function showAddedToCartMessage(productName) {
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'cart-message';
    messageDiv.style.position = 'fixed';
    messageDiv.style.bottom = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.backgroundColor = 'var(--primary-color, #2e7d32)';
    messageDiv.style.color = 'white';
    messageDiv.style.padding = '10px 20px';
    messageDiv.style.borderRadius = '4px';
    messageDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    messageDiv.style.zIndex = '1000';
    messageDiv.style.transition = 'all 0.3s ease';
    messageDiv.style.transform = 'translateY(100px)';
    
    // Add message content
    messageDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-check-circle" style="font-size: 1.2rem;"></i>
            <div>
                <p style="margin: 0;"><strong>${productName}</strong> added to cart</p>
                <a href="cart.html" style="color: white; text-decoration: underline; font-size: 0.8rem;">View Cart</a>
            </div>
            <button style="background: none; border: none; color: white; cursor: pointer; margin-left: auto;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(messageDiv);
    
    // Animate in
    setTimeout(() => {
        messageDiv.style.transform = 'translateY(0)';
    }, 10);
    
    // Setup close button
    messageDiv.querySelector('button').addEventListener('click', () => {
        messageDiv.style.transform = 'translateY(100px)';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    });
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(messageDiv)) {
            messageDiv.style.transform = 'translateY(100px)';
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }
    }, 3000);
}

// Check login status
function checkLoginStatus() {
    const userData = localStorage.getItem('grosfreshUser');
    
    if (userData) {
        const user = JSON.parse(userData);
        if (user.isLoggedIn) {
            // Update user icon in header to show logged in state
            const userIcon = document.querySelector('.nav-icons a[href="login.html"] i');
            if (userIcon) {
                userIcon.classList.remove('fa-user');
                userIcon.classList.add('fa-user-check');
            }
        }
    }
}

// Add CSS animation for cart count
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }
    
    #cart-count.pulse {
        animation: pulse 0.3s ease;
    }
`;
document.head.appendChild(style);
