document.addEventListener('DOMContentLoaded', function() {
    // Initialize add to cart buttons
    initAddToCartButtons();
    
    // Initialize filter buttons if they exist
    if (document.querySelector('.category-filter')) {
        initFilterButtons();
    }
    
    // Update cart count on page load
    updateCartCount();
});

/**
 * Initialize all add to cart buttons on the page
 */
function initAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.id;
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('$', ''));
            const productImage = productCard.querySelector('img').src;
            
            addToCart(productId, productName, productPrice, productImage);
            
            // Show added to cart notification
            showNotification(`${productName} added to cart!`);
        });
    });
}

/**
 * Add a product to the cart
 */
function addToCart(id, name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(item => item.id === id);
    
    if (existingProductIndex > -1) {
        // Product exists, increment quantity
        cart[existingProductIndex].quantity += 1;
    } else {
        // Product doesn't exist, add new product
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
}

/**
 * Update the cart count in the header
 */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Try both potential elements
    const cartCountElement = document.getElementById('cart-count') || document.querySelector('.cart-count');
    
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
        
        if (cartCount > 0) {
            cartCountElement.style.display = 'flex';
        } else {
            cartCountElement.style.display = 'none';
        }
    }
}

/**
 * Initialize filter buttons for product categories
 */
function initFilterButtons() {
    const filterButtons = document.querySelectorAll('.category-filter button');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Show/hide products based on filter
            productCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Show a notification when a product is added to cart
 */
function showNotification(message) {
    // Check if notification container exists, if not create it
    let notificationContainer = document.getElementById('notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Add styles for the notification container
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '1000';
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
} 