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
  const cartSection = document.getElementById('cart-items');
  function getStoredArray(key) { let arr = localStorage.getItem(key); return arr ? JSON.parse(arr) : []; }
  function setStoredArray(key, arr) { localStorage.setItem(key, JSON.stringify(arr)); }
  function updateCartBadge() {
    const badges = document.querySelectorAll('.header-action-btn[aria-label="cart"] .btn-badge');
    let cart = getStoredArray('cart');
    badges.forEach(badge => badge.textContent = cart.length);
  }
  function render() {
    let cart = getStoredArray('cart');
    updateCartBadge();
    if (!cart.length) {
      cartSection.innerHTML = '<p>Your cart is empty.</p>';
      return;
    }
    cartSection.innerHTML = cart.map(prod => `
      <div class="cart-card" data-product-id="${prod.id}" style="display:grid;grid-template-columns:90px 1.5fr 1fr 120px 1fr 160px;align-items:center;gap:0;padding:14px 0;border-bottom:1px solid #e0e0e0;background:#fff;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.03);border-radius:8px;">
        <img src="${prod.img}" alt="${prod.name}" style="width:70px;height:70px;object-fit:cover;border-radius:8px;justify-self:center;box-shadow:0 2px 8px #b2f7ef;">
        <div style="font-weight:600;font-size:1.1em;color:#222;">${prod.name}</div>
        <div style="color:#007bff;font-weight:600;">₹${Number(prod.price).toLocaleString()}</div>
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;">
          <button class="qty-btn" data-action="decrease" style="width:32px;height:32px;font-size:1.2em;background:#f8d7da;color:#721c24;border-radius:6px;border:none;cursor:pointer;">-</button>
          <span class="cart-qty" style="margin:0 8px;min-width:32px;display:inline-block;color:#222;font-weight:600;">${prod.qty || 1}</span>
          <button class="qty-btn" data-action="increase" style="width:32px;height:32px;font-size:1.2em;background:#d4edda;color:#155724;border-radius:6px;border:none;cursor:pointer;">+</button>
        </div>
        <div style="font-weight:600;color:#28a745;">₹${(Number(prod.price) * (prod.qty || 1)).toLocaleString()}</div>
        <div style="display:flex;gap:8px;justify-content:center;">
          <button class="move-to-wishlist" style="background:linear-gradient(90deg,#ffb347,#ffcc33);color:#222;font-weight:600;border:none;padding:7px 18px;border-radius:5px;cursor:pointer;box-shadow:0 2px 8px #ffe066;">Save</button>
          <button class="remove remove-from-cart" style="background:linear-gradient(90deg,#ff5858,#ff7b7b);color:#fff;font-weight:600;border:none;padding:7px 18px;border-radius:5px;cursor:pointer;box-shadow:0 2px 8px #ffb2b2;">Remove</button>
        </div>
      </div>
    `).join('');
    // Update total
    const total = cart.reduce((sum, prod) => sum + Number(prod.price) * (prod.qty || 1), 0);
    const totalElem = document.getElementById('cart-total');
    if (totalElem) totalElem.textContent = '₹' + total.toLocaleString();
  }
  cartSection.addEventListener('click', e => {
    const div = e.target.closest('[data-product-id]');
    const pid = div?.getAttribute('data-product-id');
    let cart = getStoredArray('cart');
    if (e.target.classList.contains('remove-from-cart')) {
      cart = cart.filter(prod => prod.id !== pid);
      setStoredArray('cart', cart);
      render();
      showPopup('Item removed from cart', '#ff5858');
      return;
    }
    if (e.target.classList.contains('move-to-wishlist')) {
      let wishlist = getStoredArray('wishlist');
      const prod = cart.find(p => p.id === pid);
      if (prod && !wishlist.find(p => p.id === pid)) {
        wishlist.push(prod);
        setStoredArray('wishlist', wishlist);
        showPopup('Saved to wishlist!', '#ffb347');
      } else {
        showPopup('Already in wishlist!', '#ffc107');
      }
      cart = cart.filter(p => p.id !== pid);
      setStoredArray('cart', cart);
      render();
      return;
    }
    if (e.target.classList.contains('qty-btn')) {
      const action = e.target.getAttribute('data-action');
      cart = cart.map(prod => {
        if (prod.id === pid) {
          let qty = prod.qty || 1;
          if (action === 'increase') qty++;
          if (action === 'decrease' && qty > 1) qty--;
          return { ...prod, qty };
        }
        return prod;
      });
      setStoredArray('cart', cart);
      render();
      return;
    }
  });
  render();
});
