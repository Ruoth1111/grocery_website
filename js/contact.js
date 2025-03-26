document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart count
    updateCartCount();
    
    // Handle FAQ accordions
    initFaqAccordion();
    
    // Handle form submission
    initContactForm();
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

// Initialize FAQ accordion functionality
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggleIcon = item.querySelector('.toggle-icon i');
        
        // Initially set the height for transition to work
        const answerHeight = answer.scrollHeight;
        
        question.addEventListener('click', () => {
            // Toggle active state
            const isActive = item.classList.contains('active');
            
            // Close all other active FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.toggle-icon i').className = 'fas fa-plus';
                    otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                }
            });
            
            // Toggle current FAQ
            if (isActive) {
                item.classList.remove('active');
                toggleIcon.className = 'fas fa-plus';
                answer.style.maxHeight = '0';
            } else {
                item.classList.add('active');
                toggleIcon.className = 'fas fa-minus';
                answer.style.maxHeight = answerHeight + 'px';
            }
        });
    });
}

// Initialize contact form submission
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: contactForm.name.value,
                email: contactForm.email.value,
                phone: contactForm.phone.value,
                subject: contactForm.subject.value,
                message: contactForm.message.value
            };
            
            // In a real application, you would send this data to a server
            console.log('Form submitted with data:', formData);
            
            // Show success message
            showNotification('Your message has been sent successfully! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
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
        
        // Add styles to notification container
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '1000';
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add styles to notification
    notification.style.backgroundColor = '#2e7d32';
    notification.style.color = 'white';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.marginBottom = '10px';
    notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    notification.style.transition = 'all 0.3s ease';
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(50px)';

    // Add notification to container
    notificationContainer.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Remove notification after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(50px)';
        
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}