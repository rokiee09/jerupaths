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
        const guide = {
            id: e.target.dataset.guideId,
            name: e.target.dataset.guideName,
            price: parseInt(e.target.dataset.guidePrice),
            image: e.target.dataset.guideImage,
            days: 1
        };

        // Check if guide is already in cart
        const existingGuide = cart.find(item => item.id === guide.id);
        if (existingGuide) {
            existingGuide.days += 1;
        } else {
            cart.push(guide);
        }

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
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span>${item.days} days</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    // Add event listeners for quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const item = cart.find(item => item.id === id);
            
            if (e.target.classList.contains('increase')) {
                item.days += 1;
            } else if (e.target.classList.contains('decrease')) {
                item.days = Math.max(1, item.days - 1);
            }
            
            updateCart();
        });
    });

    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.closest('.remove-item').dataset.id;
            cart = cart.filter(item => item.id !== id);
            updateCart();
        });
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