document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Here, you can add your logic to validate the username and password
    // For a simple example, let's just log them to the console
    console.log("Username: " + username);
    console.log("Password: " + password);

    // You can redirect to another page or perform other actions after successful login
});

// --- Wishlist & Cart Logic ---

document.addEventListener('DOMContentLoaded', function() {
    // Helper functions
    function getStoredArray(key) { let arr = localStorage.getItem(key); return arr ? JSON.parse(arr) : []; }
    function setStoredArray(key, arr) { localStorage.setItem(key, JSON.stringify(arr)); }

    // Popup message helper
    function showPopup(message, color = '#333') {
        let popup = document.createElement('div');
        popup.textContent = message;
        popup.style.position = 'fixed';
        popup.style.top = '30px';
        popup.style.right = '30px';
        popup.style.zIndex = '9999';
        popup.style.background = color;
        popup.style.color = '#fff';
        popup.style.padding = '12px 24px';
        popup.style.borderRadius = '8px';
        popup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        popup.style.fontSize = '1.1em';
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 1800);
    }

    // Add to Wishlist & Cart
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-wishlist')) {
            const card = e.target.closest('[data-product-id]');
            if (!card) return;
            const prod = {
                id: card.getAttribute('data-product-id'),
                name: card.querySelector('.card-title')?.textContent.trim() || '',
                price: card.querySelector('.price')?.textContent.replace(/[^\d]/g, '') || '',
                img: card.querySelector('img')?.getAttribute('src') || ''
            };
            let wishlist = getStoredArray('wishlist');
            if (!wishlist.find(p => p.id === prod.id)) {
                wishlist.push(prod);
                setStoredArray('wishlist', wishlist);
                showPopup('Added to Wishlist!', '#28a745');
            } else {
                showPopup('Already in Wishlist!', '#ffc107');
            }
            document.querySelectorAll('.header-action-btn[aria-label="favorite list"] .btn-badge, #wishlist-count').forEach(badge => badge.textContent = wishlist.length);
        }
        if (e.target.classList.contains('add-to-cart')) {
            const card = e.target.closest('[data-product-id]');
            if (!card) return;
            const prod = {
                id: card.getAttribute('data-product-id'),
                name: card.querySelector('.card-title')?.textContent.trim() || '',
                price: card.querySelector('.price')?.textContent.replace(/[^\d]/g, '') || '',
                img: card.querySelector('img')?.getAttribute('src') || ''
            };
            let cart = getStoredArray('cart');
            if (!cart.find(p => p.id === prod.id)) {
                cart.push(prod);
                setStoredArray('cart', cart);
                showPopup('Added to Cart!', '#007bff');
            } else {
                showPopup('Already in Cart!', '#ffc107');
            }
            document.querySelectorAll('.header-action-btn[aria-label="cart"] .btn-badge').forEach(badge => badge.textContent = cart.length);
        }
    });
});
