"use strict";

import { cartTotal, cartItems, cart, getCart, updateCart } from "./app.js";

const cartContent = document.querySelector(".cart-product-content");
const itemAmount = document.querySelector(".item-amount");
const subTotal = document.querySelector(".subtotal");
const total = document.querySelector(".total");

///////////////////////////////////////////////////////////
// Function to generate the HTML for a product in the cart
function generateCartItemHTML(item) {
  return `
    <div class="cart-product-item">
    <img src="${item.image}" alt="${item.title}" />
      <div class="cart-flex-item">
        <h4>${item.title}</h4>
        <h5>$${item.price}</h5>
        <p class="item-amount">$${item.price * item.amount}</p>
        <span class="remove-item" data-id="${
          item.id
        }"><ion-icon name="close-sharp"></ion-icon></span>
        </div>
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
  location.reload(); // Reload the page after removing the item
}

///////////////////////////////////////////////////////////
// Save the cart to local storage
function saveCartToLocalStorage(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

///////////////////////////////////////////////////////////
// Update the cart total and items count
function setCartValues(cart) {
  let tempTotal = 0;
  let itemsTotal = 0;
  cart.map((item) => {
    tempTotal += item.price * item.amount;
    itemsTotal += item.amount;
  });
  cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
  cartItems.innerText = itemsTotal;
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
  const subTotalPrice = cart.reduce(
    (total, item) => total + item.price * item.amount,
    0
  );
  if (subTotal) {
    subTotal.innerHTML = `
  <div class="subtotal-flex">
  <p>Subtotal:</p>
  <p>$${subTotalPrice.toFixed(2)}</p>
  </div>
  `;
  }

  if (total) {
    total.innerHTML = `
  <div class="total-flex">
  <p>Total:</p>
  <p>$${subTotalPrice.toFixed(2)}</p>
  </div>
  `;
  }
}
