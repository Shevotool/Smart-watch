"use strict";

import { cart, getCart, updateCart } from "./app.js";

const cartContent = document.querySelector(".cart-product-content");
const cartSubtotalElement = document.querySelector(".cart-subtotal");
const carttotalElement = document.querySelector(".cart-total-element");
const cartTotalElement = document.querySelector(".cart-total");
const cartItemsElement = document.querySelector(".cart-items");

///////////////////////////////////////////////////////////
// Function to generate the HTML for a product in the cart
function generateCartItemHTML(item) {
  return `
    <div class="cart-item-product">
 <img src=${item.image} />
            <div>
              <h4>${item.title}</h4>
              <h5>Price: $${item.price}</h5>
              <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
       
  `;
}

///////////////////////////////////////////////////////////
// Add event listeners to the "Remove" buttons in the cart
function addRemoveItemEventListeners() {
  const removeItems = document.querySelectorAll(".remove-item");

  removeItems.forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.dataset.id;
      removeCartItem(id);
    });
  });
}

///////////////////////////////////////////////////////////
// Remove a product from the cart
function removeCartItem(id) {
  let currentCart = getCart();
  let updatedCart = currentCart.filter((item) => item.id !== id);
  updateCart(updatedCart);
  displayCartItems();
  saveCartToLocalStorage(updatedCart);
  setCartValues(updatedCart);
  //location.reload(); // Reload the page after removing the item
}

///////////////////////////////////////////////////////////
// Save the cart to local storage
function saveCartToLocalStorage(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

///////////////////////////////////////////////////////////
// Display the products in the cart on the card.html page
function displayCartItems() {
  if (cartContent) {
    cartContent.innerHTML = "";
    cart.forEach((item) => {
      const cartItemHTML = generateCartItemHTML(item);
      cartContent.insertAdjacentHTML("beforeend", cartItemHTML);
    });
  }
}

///////////////////////////////////////////////////////////
// Call the necessary functions when the card.html page is loaded
document.addEventListener("DOMContentLoaded", () => {
  displayCartItems();
  addRemoveItemEventListeners();
  cartTotals();
});

function cartTotals() {
  let tempTotal = 0;
  let itemsTotal = 0;
  cart.map((item) => {
    tempTotal += item.price * item.amount;
    itemsTotal += item.amount;
  });

  if (cartSubtotalElement) {
    cartSubtotalElement.textContent = `$${tempTotal.toFixed(2)}`;
  }

  if (carttotalElement) {
    carttotalElement.textContent = `$${tempTotal.toFixed(2)}`;
  }

  const clearCartBtn = document.querySelector(".clear-cart");

  clearCartBtn.addEventListener("click", clearCart);
}

function clearCart() {
  cartContent.innerHTML = "";

  cartTotalElement.textContent = "0";
  cartItemsElement.textContent = "0";
  cartSubtotalElement.textContent = "0";
  carttotalElement.textContent = "0";

  saveCartToLocalStorage([]);
}
