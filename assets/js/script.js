'use strict';



/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
  document.body.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);



/**
 * header & back top btn active when window scroll down to 100px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const showElemOnScroll = function () {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", showElemOnScroll);



/**
 * product filter
 */

const filterBtns = document.querySelectorAll("[data-filter-btn]");
const filterBox = document.querySelector("[data-filter]");

let lastClickedFilterBtn = filterBtns[0];

const filter = function () {
  lastClickedFilterBtn.classList.remove("active");
  this.classList.add("active");
  lastClickedFilterBtn = this;

  filterBox.setAttribute("data-filter", this.dataset.filterBtn)
}

addEventOnElem(filterBtns, "click", filter);

// ====== CART & WISHLIST DYNAMIC LOGIC ======

// Selectors for product cards, add-to-cart and add-to-wishlist (favorite) icons/buttons
// Here, adjust selectors to match your actual markup for product cards and action icons

const products = [
  { id: 's25', name: 'Samsung S25 Ultra', price: 99999, img: 'assets/images/s25.jpg' },
  { id: 's24', name: 'Samsung S24', price: 79999, img: 'assets/images/product-2.jpg' },
  { id: 's23', name: 'Samsung S23', price: 59999, img: 'assets/images/product-3.jpg' }
];

function renderProducts() {
  const list = document.getElementById('product-list');
  if (!list) return;
  list.innerHTML = products.map(product => `
    <div class="product-card" data-product-id="${product.id}">
      <img src="${product.img}" alt="${product.name}" width="120" height="120">
      <h2 class="card-title">${product.name}</h2>
      <p>₹${product.price.toLocaleString()}</p>
      <button class="add-to-cart">Add to Cart</button>
      <button class="add-to-wishlist">Add to Wishlist</button>
    </div>
  `).join('');
}

function getStoredArray(key) {
  let arr = localStorage.getItem(key);
  return arr ? JSON.parse(arr) : [];
}
function setStoredArray(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

function showAlert(msg) { alert(msg); }

function updateCartBadge() {
  const badges = document.querySelectorAll('.header-action-btn[aria-label="cart"] .btn-badge');
  let cart = getStoredArray('cart');
  badges.forEach(badge => badge.textContent = cart.length);
}
function updateWishlistBadge() {
  const badges = document.querySelectorAll('.header-action-btn[aria-label="favorite list"] .btn-badge');
  let wishlist = getStoredArray('wishlist');
  badges.forEach(badge => badge.textContent = wishlist.length);
}


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

function addProductTo(key, card) {
  const id = card.getAttribute('data-product-id');
  const name = card.querySelector('.card-title')?.textContent.trim() || '';
  const price = card.querySelector('.price')?.textContent.replace(/[^\d]/g, '') || '';
  const img = card.querySelector('img')?.getAttribute('src') || '';
  let arr = getStoredArray(key);
  if (!arr.find(p => p.id === id)) {
    arr.push({ id, name, price, img });
    setStoredArray(key, arr);
    if (key === 'cart') updateCartBadge();
    if (key === 'wishlist') updateWishlistBadge();
    showPopup(`Added to ${key.charAt(0).toUpperCase() + key.slice(1)}!`, key === 'cart' ? '#007bff' : '#28a745');
  } else {
    showPopup(`Already in ${key.charAt(0).toUpperCase() + key.slice(1)}!`, '#ffc107');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  updateCartBadge();
  updateWishlistBadge();

  document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
      const card = e.target.closest('.product-card');
      if (card) addProductTo('cart', card);
    }
    if (e.target.classList.contains('add-to-wishlist')) {
      const card = e.target.closest('.product-card');
      if (card) addProductTo('wishlist', card);
    }
  });
});