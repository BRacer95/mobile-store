  // Popup notification helper
  function showPopup(message, color = '#333') {
    let popup = document.createElement('div');
    popup.textContent = message;
    popup.style.position = 'fixed';
    popup.style.left = '50%';
    popup.style.bottom = '30px';
    popup.style.transform = 'translateX(-50%)';
    popup.style.zIndex = '9999';
    popup.style.background = color;
    popup.style.color = '#fff';
    popup.style.padding = '14px 32px';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 2px 12px rgba(0,0,0,0.18)';
    popup.style.fontSize = '1.1em';
    popup.style.fontWeight = '600';
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1800);
  }
document.addEventListener('DOMContentLoaded', function() {
  const wishlistSection = document.getElementById('wishlist-items');
  function getStoredArray(key) { let arr = localStorage.getItem(key); return arr ? JSON.parse(arr) : []; }
  function setStoredArray(key, arr) { localStorage.setItem(key, JSON.stringify(arr)); }
  function updateWishlistBadge() {
    const badges = document.querySelectorAll('.header-action-btn[aria-label="favorite list"] .btn-badge');
    let wishlist = getStoredArray('wishlist');
    badges.forEach(badge => badge.textContent = wishlist.length);
  }
  function render() {
    let wishlist = getStoredArray('wishlist');
    updateWishlistBadge();
    if (!wishlist.length) {
      wishlistSection.innerHTML = '<p>Your wishlist is empty.</p>';
      return;
    }
    wishlistSection.innerHTML = wishlist.map(prod => `
      <div class="wishlist-card" data-product-id="${prod.id}" style="display:grid;grid-template-columns:90px 2fr 1fr 1fr 1fr;align-items:center;gap:0;padding:14px 0;border-bottom:1px solid #eee;text-align:center;">
        <img src="${prod.img}" alt="${prod.name}" style="width:70px;height:70px;object-fit:cover;border-radius:8px;justify-self:center;">
        <div style="font-weight:600;font-size:1.1em;">${prod.name}</div>
        <div style="color:#555;">₹${Number(prod.price).toLocaleString()}</div>
        <button class="move-to-cart" style="background:#28a745;color:#fff;border:none;padding:7px 14px;border-radius:5px;cursor:pointer;">Move to Cart</button>
        <button class="remove remove-from-wishlist" style="background:#dc3545;color:#fff;border:none;padding:7px 14px;border-radius:5px;cursor:pointer;">Remove</button>
      </div>
    `).join('');
  }
  wishlistSection.addEventListener('click', e => {
    const div = e.target.closest('[data-product-id]');
    const pid = div?.getAttribute('data-product-id');
    if (e.target.classList.contains('remove-from-wishlist')) {
      let wishlist = getStoredArray('wishlist');
      wishlist = wishlist.filter(prod => prod.id !== pid);
      setStoredArray('wishlist', wishlist);
      render();
      showPopup('Item removed from wishlist', '#ff5858');
    }
    if (e.target.classList.contains('move-to-cart')) {
      let wishlist = getStoredArray('wishlist');
      let cart = getStoredArray('cart');
      const prod = wishlist.find(p => p.id === pid);
      if (prod && !cart.find(p => p.id === pid)) {
        cart.push(prod);
        setStoredArray('cart', cart);
        showPopup('Moved to cart!', '#007bff');
      } else {
        showPopup('Already in cart!', '#ffc107');
      }
      wishlist = wishlist.filter(p => p.id !== pid);
      setStoredArray('wishlist', wishlist);
      render();
    }
  });
  render();
});
