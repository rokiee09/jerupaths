// Cart functionality
let cart = [];
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.querySelector('.cart-count');
const cartSubtotal = document.getElementById('cartSubtotal');
const cartDays = document.getElementById('cartDays');
const cartTotal = document.getElementById('cartTotal');

// Initialize date pickers
document.querySelectorAll('.date-picker').forEach(input => {
    flatpickr(input, {
        mode: "range",
        minDate: "today",
        dateFormat: "Y-m-d",
        onChange: function(selectedDates, dateStr, instance) {
            if (selectedDates.length === 2) {
                const days = Math.ceil((selectedDates[1] - selectedDates[0]) / (1000 * 60 * 60 * 24)) + 1;
                const guideId = instance.element.dataset.guideId;
                const addToCartBtn = document.querySelector(`.add-to-cart[data-guide-id="${guideId}"]`);
                
                // Store selected dates in the button's dataset
                addToCartBtn.dataset.startDate = selectedDates[0].toISOString().split('T')[0];
                addToCartBtn.dataset.endDate = selectedDates[1].toISOString().split('T')[0];
                addToCartBtn.dataset.days = days;
            }
        }
    });
});

// Toggle cart sidebar
cartIcon.addEventListener('click', () => {
    cartSidebar.classList.add('open');
});

closeCart.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
});

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        const button = e.target.closest('.add-to-cart');
        if (!button) return;

        if (!button.dataset.startDate || !button.dataset.endDate) {
            alert('Please select dates first');
            return;
        }

        const guide = {
            id: button.dataset.guideId,
            name: button.dataset.guideName,
            price: parseInt(button.dataset.guidePrice),
            image: button.dataset.guideImage,
            startDate: button.dataset.startDate,
            endDate: button.dataset.endDate,
            days: parseInt(button.dataset.days)
        };

        // Check if guide is already in cart for the same dates
        const existingGuide = cart.find(item => 
            item.id === guide.id && 
            item.startDate === guide.startDate && 
            item.endDate === guide.endDate
        );

        if (existingGuide) {
            alert('This guide is already booked for these dates');
            return;
        }

        cart.push(guide);
        updateCart();
        cartSidebar.classList.add('open');
    });
});

// Update cart UI
function updateCart() {
    // Update cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price} per day</div>
                <div class="cart-item-dates">
                    ${item.startDate} to ${item.endDate}
                    <br>
                    ${item.days} days
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}" data-start="${item.startDate}" data-end="${item.endDate}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const button = e.target.closest('.remove-item');
            if (!button) return;

            const id = button.dataset.id;
            const startDate = button.dataset.start;
            const endDate = button.dataset.end;
            
            cart = cart.filter(item => 
                !(item.id === id && 
                  item.startDate === startDate && 
                  item.endDate === endDate)
            );
            updateCart();
        });S
    });

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.days, 0);
    cartCount.textContent = totalItems;

    // Update totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.days), 0);
    const totalDays = cart.reduce((sum, item) => sum + item.days, 0);
    
    cartSubtotal.textContent = `$${subtotal}`;
    cartDays.textContent = totalDays;
    cartTotal.textContent = `$${subtotal}`;
}

// Initialize cart
updateCart(); 