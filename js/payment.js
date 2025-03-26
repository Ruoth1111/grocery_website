// DOM Elements
const paymentOptions = document.querySelectorAll('.payment-option');
const paymentForms = document.querySelectorAll('.payment-form');
const summaryItemsContainer = document.getElementById('summary-items');
const subtotalElement = document.getElementById('subtotal');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');
const placeOrderBtn = document.getElementById('place-order');
const successModal = document.getElementById('success-modal');
const closeModal = document.querySelector('.close-modal');
const orderNumberElement = document.getElementById('order-number');
const confirmationEmailElement = document.getElementById('confirmation-email');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Load cart data and update summary
    loadCartSummary();
    
    // Fill form with user data if available
    fillUserData();
    
    // Set up payment method selection
    setupPaymentMethods();
    
    // Set up place order button
    setupPlaceOrderButton();
    
    // Set up modal close button
    setupModalClose();
});

// Load cart data and update summary
function loadCartSummary() {
    const cart = getCart();
    
    if (cart.length === 0) {
        // Redirect to cart page if cart is empty
        window.location.href = 'cart.html';
        return;
    }
    
    // Update cart count in the header
    updateCartCount(cart.length);
    
    // Display cart items in summary
    displayCartItems(cart);
    
    // Calculate and display totals
    calculateTotals(cart);
}

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('grosfreshCart');
    return cart ? JSON.parse(cart) : [];
}

// Update cart count
function updateCartCount(count) {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// Display cart items in summary
function displayCartItems(cart) {
    summaryItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'summary-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-price">$${item.price}</div>
            </div>
            <div class="item-quantity">x${item.quantity}</div>
        `;
        summaryItemsContainer.appendChild(itemElement);
    });
}

// Calculate and display totals
function calculateTotals(cart) {
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
    }, 0);
    
    // Fixed shipping cost
    const shipping = 4.99;
    
    // Calculate tax (assuming 8% tax rate)
    const tax = subtotal * 0.08;
    
    // Calculate total
    const total = subtotal + shipping + tax;
    
    // Display values
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Fill form with user data if available
function fillUserData() {
    const userData = localStorage.getItem('grosfreshUser');
    
    if (userData) {
        const user = JSON.parse(userData);
        
        // Fill email
        const emailInput = document.getElementById('email');
        if (emailInput && user.email) {
            emailInput.value = user.email;
        }
        
        // Fill name if available (assuming format: "First Last")
        if (user.name && user.name.includes(' ')) {
            const [firstName, lastName] = user.name.split(' ');
            const firstNameInput = document.getElementById('first-name');
            const lastNameInput = document.getElementById('last-name');
            
            if (firstNameInput) firstNameInput.value = firstName;
            if (lastNameInput) lastNameInput.value = lastName;
        }
    }
}

// Set up payment method selection
function setupPaymentMethods() {
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Update active payment option
            paymentOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Get payment method
            const paymentMethod = this.querySelector('input').id;
            
            // Show corresponding form
            paymentForms.forEach(form => form.style.display = 'none');
            document.getElementById(`${paymentMethod}-form`).style.display = 'block';
            
            // Check the radio button
            this.querySelector('input').checked = true;
        });
    });
}

// Set up place order button
function setupPlaceOrderButton() {
    placeOrderBtn.addEventListener('click', function() {
        // Get active payment method
        const activePaymentMethod = document.querySelector('.payment-option.active input').id;
        
        // Validate form based on payment method
        if (validateForms(activePaymentMethod)) {
            // Process order
            processOrder(activePaymentMethod);
        }
    });
}

// Validate forms
function validateForms(paymentMethod) {
    // Basic validation for billing information
    const requiredBillingFields = [
        'first-name',
        'last-name',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'zipcode',
        'country'
    ];
    
    let isValid = true;
    
    // Validate billing form
    requiredBillingFields.forEach(field => {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else {
            clearError(input);
        }
    });
    
    // Validate email format
    const emailInput = document.getElementById('email');
    if (emailInput.value.trim() && !validateEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate payment form based on method
    if (paymentMethod === 'credit-card') {
        // Credit card validation
        const cardInputs = ['card-number', 'card-name', 'expiry', 'cvv'];
        
        cardInputs.forEach(field => {
            const input = document.getElementById(field);
            if (!input.value.trim()) {
                showError(input, 'This field is required');
                isValid = false;
            } else {
                clearError(input);
            }
        });
        
        // Validate card number format (simple validation)
        const cardNumberInput = document.getElementById('card-number');
        if (cardNumberInput.value.trim() && !validateCardNumber(cardNumberInput.value)) {
            showError(cardNumberInput, 'Please enter a valid card number');
            isValid = false;
        }
        
        // Validate expiry date format (MM/YY)
        const expiryInput = document.getElementById('expiry');
        if (expiryInput.value.trim() && !validateExpiry(expiryInput.value)) {
            showError(expiryInput, 'Please enter a valid expiry date (MM/YY)');
            isValid = false;
        }
        
        // Validate CVV (3-4 digits)
        const cvvInput = document.getElementById('cvv');
        if (cvvInput.value.trim() && !validateCVV(cvvInput.value)) {
            showError(cvvInput, 'Please enter a valid 3-4 digit CVV code');
            isValid = false;
        }
    }
    
    return isValid;
}

// Process order
function processOrder(paymentMethod) {
    // Show loading state
    placeOrderBtn.disabled = true;
    placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    // Simulate processing delay
    setTimeout(() => {
        // Generate random order number
        const orderNumber = 'GF' + Math.floor(100000 + Math.random() * 900000);
        
        // Get user email
        const userEmail = document.getElementById('email').value;
        
        // Update order confirmation details
        orderNumberElement.textContent = orderNumber;
        confirmationEmailElement.textContent = userEmail;
        
        // Clear cart
        localStorage.removeItem('grosfreshCart');
        
        // Show success modal
        successModal.style.display = 'flex';
        
        // Reset button state
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place Order';
    }, 2000);
}

// Set up modal close button
function setupModalClose() {
    closeModal.addEventListener('click', function() {
        successModal.style.display = 'none';
        
        // Redirect to home page
        window.location.href = 'index.html';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === successModal) {
            successModal.style.display = 'none';
            
            // Redirect to home page
            window.location.href = 'index.html';
        }
    });
}

// Helper functions
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateCardNumber(cardNumber) {
    // Remove spaces and dashes
    const card = cardNumber.replace(/[\s-]/g, '');
    // Check if it's numeric and between 13-19 digits
    return /^\d{13,19}$/.test(card);
}

function validateExpiry(expiry) {
    // Check MM/YY format
    return /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiry);
}

function validateCVV(cvv) {
    // Check if it's 3-4 digits
    return /^[0-9]{3,4}$/.test(cvv);
}

function showError(input, message) {
    // Get parent form group
    const formGroup = input.closest('.form-group');
    
    // Remove any existing error
    clearError(input);
    
    // Add error class to form group
    formGroup.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#e74c3c';
    errorElement.style.fontSize = '0.85rem';
    errorElement.style.marginTop = '5px';
    
    // Add error message below input
    formGroup.appendChild(errorElement);
    
    // Highlight input
    input.style.borderColor = '#e74c3c';
}

function clearError(input) {
    // Get parent form group
    const formGroup = input.closest('.form-group');
    
    // Remove error class
    formGroup.classList.remove('error');
    
    // Remove error message
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
    
    // Reset input style
    input.style.borderColor = '';
}

// Add event listeners for real-time form validation and masking
document.addEventListener('DOMContentLoaded', function() {
    // Credit card number formatting
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            if (value.length > 16) value = value.slice(0, 16); // Limit to 16 digits
            
            // Add spaces after every 4 digits
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            
            e.target.value = value;
        });
    }
    
    // Expiry date formatting (MM/YY)
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            if (value.length > 4) value = value.slice(0, 4); // Limit to 4 digits
            
            if (value.length > 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            
            e.target.value = value;
        });
    }
    
    // CVV formatting
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            if (value.length > 4) value = value.slice(0, 4); // Limit to 4 digits
            e.target.value = value;
        });
    }
});

// Style for error messages
const style = document.createElement('style');
style.textContent = `
    .form-group.error input {
        border-color: #e74c3c;
    }
    
    @keyframes highlightField {
        0% { background-color: rgba(231, 76, 60, 0.1); }
        100% { background-color: transparent; }
    }
    
    .form-group.error input {
        animation: highlightField 0.5s ease;
    }
`;
document.head.appendChild(style);
