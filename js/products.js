document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart count
    updateCartCount();

    // Add event listeners to "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Handle price range slider
    const priceSlider = document.getElementById('price-slider');
    const priceValue = document.getElementById('price-value');
    
    if (priceSlider && priceValue) {
        priceSlider.addEventListener('input', () => {
            priceValue.textContent = `$${priceSlider.value}`;
            // Would normally filter products here
        });
    }

    // Handle "Apply Filters" button
    const applyFiltersBtn = document.querySelector('.apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    // Handle pagination
    initPagination();
});

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Update cart count in header
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return;
    
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = count;
}

// Initialize pagination functionality
function initPagination() {
    const paginationLinks = document.querySelectorAll('.pagination a');
    const productCards = document.querySelectorAll('.product-card');
    
    // Set items per page
    const itemsPerPage = 6;
    
    // Calculate total pages needed
    const totalPages = Math.ceil(productCards.length / itemsPerPage);
    
    // Hide all products initially except first page
    productCards.forEach((card, index) => {
        if (index < itemsPerPage) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Add click event to pagination links
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            paginationLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            const page = this.getAttribute('data-page');
            
            if (page === 'next') {
                // Find current active page and go to next if possible
                const currentPage = parseInt(document.querySelector('.pagination a.active').getAttribute('data-page'));
                if (currentPage < totalPages) {
                    const nextPageLink = document.querySelector(`.pagination a[data-page="${currentPage + 1}"]`);
                    if (nextPageLink) {
                        nextPageLink.click();
                    }
                }
                return;
            }
            
            const pageNum = parseInt(page);
            
            // Show products for selected page
            productCards.forEach((card, index) => {
                const start = (pageNum - 1) * itemsPerPage;
                const end = start + itemsPerPage;
                
                if (index >= start && index < end) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Scroll to top of products section
            const productsSection = document.querySelector('.products-section');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Add product to cart
function addToCart(event) {
    const productCard = event.target.closest('.product-card');
    if (!productCard) return;

    const productName = productCard.querySelector('h3').textContent;
    const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('$', ''));
    const productImage = productCard.querySelector('img').src;

    // Get current cart
    const cart = getCart();

    // Check if product already in cart
    const existingProductIndex = cart.findIndex(item => item.name === productName);

    if (existingProductIndex > -1) {
        // Update quantity if product already in cart
        cart[existingProductIndex].quantity += 1;
    } else {
        // Add new product to cart
        cart.push({
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart count
    updateCartCount();

    // Show notification
    showNotification(`${productName} added to cart!`);
}

// Apply filters (placeholder function - would normally filter products)
function applyFilters() {
    const selectedCategories = [];
    const categoryCheckboxes = document.querySelectorAll('.filter-list input[type="checkbox"]');
    
    categoryCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedCategories.push(checkbox.id);
        }
    });

    const maxPrice = document.getElementById('price-slider').value;
    const sortBy = document.getElementById('sort-by').value;

    // In a real implementation, this would filter the products based on the selected filters
    console.log('Applying filters:', {
        categories: selectedCategories,
        maxPrice: maxPrice,
        sortBy: sortBy
    });

    // Show notification
    showNotification('Filters applied!');
    
    // Reset to page 1 after applying filters
    const page1Link = document.querySelector('.pagination a[data-page="1"]');
    if (page1Link) {
        page1Link.click();
    }
}

// Show notification
function showNotification(message) {
    // Check if notification container exists, create if not
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Add notification to container
    notificationContainer.appendChild(notification);

    // Remove notification after delay
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
