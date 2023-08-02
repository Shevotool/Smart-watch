"use strict";

import { cartContent, cartTotal, cartItems, Storage, cart } from "./app.js";

// Variables
const urlParams = new URLSearchParams(window.location.search);
const productSrc = urlParams.get("src");
const productName = urlParams.get("name");
const productPrice = urlParams.get("price");
const productId = urlParams.get("id");
const productDescription = urlParams.get("description");

// DOM Elements
const productImage = document.querySelector("#product-image");
const productNameElement = document.querySelector("#product-name");
const productPriceElement = document.querySelector("#product-price");
const productDescriptionElement = document.querySelector(
  "#product-description"
);
const productBtn = document.querySelector(".product-btn");
const viewCartButton = document.querySelector(".view-cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartDOM = document.querySelector(".cart");
const clearCartBtn = document.querySelector(".clear-cart");

///////////////////////////////////////////////////////////
// Set Cart values
function setCartValues(cart) {
  let tempTotal = 0;
  let itemsTotal = 0;
  cart.forEach((item) => {
    tempTotal += item.price * item.amount;
    itemsTotal += item.amount;
  });
  cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
  cartItems.innerText = itemsTotal;
}

///////////////////////////////////////////////////////////
// Add to Cart
function addCartItem(item) {
  const div = document.createElement("div");
  div.classList.add("cart-item");
  div.innerHTML = `<img src="${item.image}"/>
            <div>
              <h4>${item.title}</h4>
              <h5>$${item.price}</h5>
               <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
              <i class="fas fa-chevron-up" data-id=${item.id}></i>
               <p class="item-amount">${item.amount}</p>
              <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>`;
  cartContent.appendChild(div);
}

function getBagButtons(button) {
  let idProduct = button.dataset.id;
  let inCart = cart.find((item) => item.idProduct === idProduct);
  if (inCart) {
    button.innerText = "In Cart";
    button.disabled = true;
  }
}

///////////////////////////////////////////////////////////
// Click to Product button
productBtn.addEventListener("click", function () {
  let cartItem = { ...Storage.getProduct(productId), amount: 1 };
  cart.push(cartItem);
  Storage.saveCart(cart);
  setCartValues(cart);
  addCartItem(cartItem);
  getBagButtons(productBtn);
  sessionStorage.setItem("showCart", "true");
  window.location.href = "index.html";
});

clearCartBtn.addEventListener("click", function () {
  productBtn.innerText = "Add to Cart";
  productBtn.disabled = false;
});

function hideCart() {
  cartOverlay.classList.remove("transparentBcg");
  cartDOM.classList.remove("showCart");
}

cartContent.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-item")) {
    productBtn.innerText = "Add to Cart";
    productBtn.disabled = false;
    hideCart();
  }
});

///////////////////////////////////////////////////////////
// Show Product Image
if (productSrc) {
  productImage.src = productSrc;
} else {
  console.log("Undefined");
}

///////////////////////////////////////////////////////////
// Show Product Name
if (productName) {
  productNameElement.textContent = decodeURIComponent(productName);
}

///////////////////////////////////////////////////////////
// Show Product Price
if (productPrice) {
  productPriceElement.textContent = `$ ${decodeURIComponent(productPrice)} `;
}

///////////////////////////////////////////////////////////
// Show Product Description
if (productDescription) {
  productDescriptionElement.textContent =
    decodeURIComponent(productDescription);
}

document.addEventListener("DOMContentLoaded", function () {
  viewCartButton.addEventListener("click", function () {
    window.location.href = "cart.html";
  });
});
