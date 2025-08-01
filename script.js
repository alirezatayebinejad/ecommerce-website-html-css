// Authentication check
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentPage = window.location.pathname.split('/').pop();
    
    // If not logged in and not on login page, redirect to login
    if (!isLoggedIn && currentPage !== 'login.html') {
        window.location.href = 'login.html';
        return false;
    }
    
    // If logged in and on login page, redirect to home
    if (isLoggedIn && currentPage === 'login.html') {
        window.location.href = 'index.html';
        return false;
    }
    
    return isLoggedIn;
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    
    // Add logout button to header if user is logged in
    const headerList = document.querySelector('.header-list');
    if (headerList && localStorage.getItem('isLoggedIn') === 'true') {
        const logoutBtn = document.createElement('li');
        logoutBtn.innerHTML = '<a href="#" onclick="logout()">Logout</a>';
        headerList.appendChild(logoutBtn);
    }
});

// focus the cursor on the email-address input
const emailField = document.getElementById("email-address-input");
if (emailField) {
    emailField.focus({
        preventScroll: true,
    });
}

// Store feedback in localStorage
let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Create feedback object
    const feedback = {
        name,
        email,
        subject,
        message,
        timestamp: new Date().toISOString()
    };
    
    // Add to feedbacks array
    feedbacks.unshift(feedback);
    
    // Store in localStorage
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    
    // Update display
    displayFeedbacks();
    
    // Reset form
    document.getElementById('contactForm').reset();
    
    // Show success message
    alert('Thank you for your feedback!');
    
    return false;
}

// Display feedbacks
function displayFeedbacks() {
    const feedbackList = document.getElementById('feedbackList');
    if (!feedbackList) return;
    
    feedbackList.innerHTML = feedbacks.map(feedback => `
        <div class="feedback-item">
            <h3>${feedback.subject}</h3>
            <p>${feedback.message}</p>
            <p><strong>${feedback.name}</strong></p>
            <div class="timestamp">${new Date(feedback.timestamp).toLocaleString()}</div>
        </div>
    `).join('');
}

// Display feedbacks when page loads
document.addEventListener('DOMContentLoaded', displayFeedbacks);

// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Initialize cart from localStorage or empty array
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log('Initial cart:', cart);

    // Handle adding items to cart
    document.body.addEventListener('click', function(e) {
        const cartBtn = e.target.closest('.cart-btn');
        if (cartBtn) {
            e.preventDefault();
            
            // Get product info
            const product = cartBtn.closest('.product-cart');
            if (!product) {
                console.error('Product element not found');
                return;
            }

            const nameElement = product.querySelector('h4:not(.price)');
            const priceElement = product.querySelector('.price');
            const imageElement = product.querySelector('img');

            if (!nameElement || !priceElement || !imageElement) {
                console.error('Required product elements not found');
                return;
            }

            const item = {
                name: nameElement.textContent,
                price: parseFloat(priceElement.textContent.replace('₹', '').replace(',', '')),
                image: imageElement.src,
                quantity: 1,
                id: Date.now()
            };
            
            console.log('Adding item with price:', item.price);
            
            // Add to cart
            cart.push(item);
            
            // Save to localStorage
            try {
                localStorage.setItem('cart', JSON.stringify(cart));
                console.log('Added item:', item);
                console.log('Updated cart:', cart);
                
                // Update UI
                updateCartCount();
                displayCart();
                alert('Added to cart: ' + item.name);
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                alert('Error adding item to cart');
            }
        }
    });

    // Handle removing items from cart
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount();
    };

    // Update cart count in header
    function updateCartCount() {
        const count = cart.length;
        console.log('Updating cart count:', count);
        const cartIcon = document.querySelector('.header-list-icon .fa-bag-shopping');
        if (cartIcon) {
            let badge = cartIcon.querySelector('.cart-count');
            if (count > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'cart-count';
                    cartIcon.parentElement.appendChild(badge);
                }
                badge.textContent = count;
            } else if (badge) {
                badge.remove();
            }
        }
    }

    // Display cart on cart page
    function displayCart() {
        const cartContainer = document.getElementById('cart-items');
        const totalItemsElement = document.getElementById('total-items');
        const totalAmountElement = document.getElementById('total-amount');
        
        console.log('Display cart called');
        console.log('Cart container:', cartContainer);
        console.log('Total items element:', totalItemsElement);
        console.log('Total amount element:', totalAmountElement);
        console.log('Current cart:', cart);

        // If not on cart page, just return
        if (!cartContainer) {
            console.log('Not on cart page');
            return;
        }

        // Handle empty cart
        if (cart.length === 0) {
            console.log('Cart is empty');
            cartContainer.innerHTML = '<p>Your cart is empty</p>';
            if (totalItemsElement) totalItemsElement.textContent = '0';
            if (totalAmountElement) totalAmountElement.textContent = '0';
            return;
        }

        // Calculate totals
        let totalAmount = 0;
        const cartHTML = cart.map((item, index) => {
            const itemTotal = item.price * item.quantity;
            totalAmount += itemTotal;
            console.log(`Item ${index}:`, item.name, 'Price:', item.price, 'Total:', itemTotal);
            
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Price: ₹${item.price.toLocaleString('en-IN')}</p>
                        <p>Quantity: ${item.quantity}</p>
                    </div>
                    <div class="cart-item-price">₹${itemTotal.toLocaleString('en-IN')}</div>
                    <button onclick="removeFromCart(${index})" class="remove-item">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            `;
        }).join('');

        // Update DOM
        console.log('Total amount calculated:', totalAmount);
        cartContainer.innerHTML = cartHTML;
        
        if (totalItemsElement) {
            console.log('Updating total items:', cart.length);
            totalItemsElement.textContent = cart.length.toString();
        }
        
        if (totalAmountElement) {
            console.log('Updating total amount:', totalAmount);
            totalAmountElement.textContent = totalAmount.toLocaleString('en-IN');
        }
    }

    // Handle checkout
    window.proceedToCheckout = function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        const modal = document.getElementById('registration-modal');
        if (modal) modal.style.display = 'block';
    };

    // Close modal
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.onclick = function() {
            document.getElementById('registration-modal').style.display = 'none';
        };
    }

    // Close modal when clicking outside
    window.onclick = function(e) {
        const modal = document.getElementById('registration-modal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Handle registration form submission
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        // Validate phone number
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 10) value = value.slice(0, 10);
                e.target.value = value;
            });
        }

        // Validate ZIP code
        const zipInput = document.getElementById('zip');
        if (zipInput) {
            zipInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 6) value = value.slice(0, 6);
                e.target.value = value;
            });
        }

        // Format card number with spaces
        const cardNumberInput = document.getElementById('card-number');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = '';
                for (let i = 0; i < value.length; i++) {
                    if (i > 0 && i % 4 === 0) {
                        formattedValue += ' ';
                    }
                    formattedValue += value[i];
                }
                e.target.value = formattedValue.slice(0, 19);
            });
        }

        // Format expiry date
        const expiryInput = document.getElementById('expiry');
        if (expiryInput) {
            expiryInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
                if (value.length > 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2);
                }
                e.target.value = value.slice(0, 5);
            });
        }

        // Format CVV
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
                e.target.value = value.slice(0, 3);
            });
        }

        // Function to show bill
        function showBill(orderData) {
            // Update customer details
            document.getElementById('bill-name').textContent = orderData.name;
            document.getElementById('bill-email').textContent = orderData.email;
            document.getElementById('bill-phone').textContent = orderData.phone;
            
            // Update shipping address
            document.getElementById('bill-address').textContent = `${orderData.street}, ${orderData.city}, ${orderData.state} ${orderData.zip}, ${orderData.country}`;
            
            // Update order items
            const itemsHtml = orderData.items.map(item => `
                <div class="bill-item">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>₹${item.price.toLocaleString('en-IN')}</span>
                </div>
            `).join('');
            
            document.getElementById('bill-items').innerHTML = itemsHtml;
            
            // Update totals
            document.getElementById('bill-total-items').textContent = orderData.items.length;
            document.getElementById('bill-total-amount').textContent = orderData.total.toLocaleString('en-IN');
            
            // Hide registration modal and show bill modal
            document.getElementById('registration-modal').style.display = 'none';
            document.getElementById('bill-modal').style.display = 'block';
        }

        // Update the registration form submission
        registrationForm.onsubmit = function(e) {
            e.preventDefault();
            
            // Get all form inputs
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = phoneInput.value.trim();
            const street = document.getElementById('street').value.trim();
            const city = document.getElementById('city').value.trim();
            const state = document.getElementById('state').value.trim();
            const zip = zipInput.value.trim();
            const country = document.getElementById('country').value.trim();
            const cardNumber = cardNumberInput.value.replace(/\s/g, '');
            const expiry = expiryInput.value;
            const cvv = cvvInput.value;
            const cardName = document.getElementById('card-name').value.trim();

            // Validation rules
            if (name.length < 3) {
                alert('Please enter a valid name (at least 3 characters)');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            if (phone.length < 10) {
                alert('Please enter a valid phone number (10 digits)');
                return;
            }

            if (street.length < 5) {
                alert('Please enter a valid street address');
                return;
            }

            if (city.length < 2) {
                alert('Please enter a valid city name');
                return;
            }

            if (state.length < 2) {
                alert('Please enter a valid state name');
                return;
            }

            if (zip.length < 5) {
                alert('Please enter a valid ZIP code');
                return;
            }

            if (country.length < 2) {
                alert('Please enter a valid country name');
                return;
            }

            // Card validation
            if (cardNumber.length !== 16) {
                alert('Please enter a valid 16-digit card number');
                return;
            }

            if (!/^\d{2}\/\d{2}$/.test(expiry)) {
                alert('Please enter a valid expiry date (MM/YY)');
                return;
            }

            const [month, year] = expiry.split('/');
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;

            if (parseInt(year) < currentYear || 
                (parseInt(year) === currentYear && parseInt(month) < currentMonth) ||
                parseInt(month) > 12) {
                alert('Please enter a valid expiry date');
                return;
            }

            if (cvv.length !== 3) {
                alert('Please enter a valid 3-digit CVV');
                return;
            }

            if (cardName.length < 3) {
                alert('Please enter the name as it appears on your card');
                return;
            }

            // Calculate total amount
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            const orderData = {
                name,
                email,
                phone,
                street,
                city,
                state,
                zip,
                country,
                cardNumber,
                cardName,
                items: cart,
                total
            };

            // Show bill directly
            showBill(orderData);
            
            // Clear cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
            updateCartCount();
        };
    }

    // Initial setup - Call both functions
    console.log('Running initial setup');
    updateCartCount();
    displayCart(); // Always try to display cart
});

