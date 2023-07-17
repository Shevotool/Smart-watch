"use strict";

export { Storage, cart, cartContent, cartItems, cartTotal };

///////////////////////////////////////////////////////////
// Contenful api

const client = contentful.createClient({
  // This is the space ID in Contentful
  space: "1vweu86iekvi",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: "S9ISYI4TLdUw1NjlOeu4XHDbWNVA0VYvLWWf8l1HUNc",
});

///////////////////////////////////////////////////////////
// Variables

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
const cardFilter = document.querySelector(".card-filter");

///////////////////////////////////////////////////////////
// Menu

// cart-menu
const menuFlex = document.querySelector(".menu-flex");
const menuOverlay = document.querySelector(".menu-overlay");
const menuDom = document.querySelector(".menu");
const closeMenuBtn = document.querySelector(".close-cart-menu");

const showMenu = function () {
  menuOverlay.classList.add("transparentBcg");
  menuDom.classList.add("showMenu");
};

const closeMenu = function () {
  menuOverlay.classList.remove("transparentBcg");
  menuDom.classList.remove("showMenu");
};

closeMenuBtn.addEventListener("click", function () {
  if (menuDom.classList.contains("showMenu")) {
    closeMenu();
  }
});

menuFlex.addEventListener("click", function () {
  if (!menuDom.classList.contains("showMenu")) {
    showMenu();
  }
});

///////////////////////////////////////////////////////////
// Products container left

document.addEventListener("DOMContentLoaded", function () {
  const containerLeft = document.querySelector(".products-container-left");
  const header = document.querySelector("header");

  if (containerLeft) {
    function updateSticky() {
      const headerTop = header.getBoundingClientRect().top;

      if (window.scrollY > headerTop) {
        containerLeft.classList.add("sticky");
      } else {
        containerLeft.classList.remove("sticky");
      }
    }
    window.addEventListener("scroll", updateSticky);
    updateSticky();
  }
});

// cart
let cart = [];

// buttons
let buttonsDOM = [];

///////////////////////////////////////////////////////////
// Getting the products
class Products {
  async getProducts() {
    try {
      let contenful = await client.getEntries({
        content_type: "comfyHouseProducts",
      });
      let products = contenful.items;
      products = products.map((item) => {
        const { title, price, description } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;

        return { title, price, description, id, image };
      });
      return products;
    } catch (error) {
      throw new Error(`Error with products ${error.message}`);
    }
  }
}

///////////////////////////////////////////////////////////
// display products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `
          <!-- single product -->
        <article class="product">
          <div class="img-container">
            <img
              src=${product.image}
              alt="product"
              class="product-img"
              data-id="${product.id}"
               data-name="${product.title}"
               data-price="${product.price}"
            />
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i>
              add to bag
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>$${product.price}</h4>
        </article>
        <!-- end of single product -->
      `;
    });

    if (productsDOM) {
      productsDOM.innerHTML = result;
    }

    ///////////////////////////////////////////////////////////
    // Products.html

    const displayProductImages = function () {
      const productImages = document.querySelectorAll(".product-img");
      productImages.forEach((product) => {
        product.addEventListener("click", () => {
          const index = Array.from(productImages).indexOf(product);
          const productData = products[index];
          const { id, title, price, description, image } = productData;
          const productImage = product.getAttribute("src");
          window.location.href = `products.html?id=${encodeURIComponent(
            id
          )}&src=${encodeURIComponent(productImage)}&name=${encodeURIComponent(
            title
          )}&price=${encodeURIComponent(
            price
          )}&description=${encodeURIComponent(description)}`;
        });
      });
    };

    displayProductImages();
  }

  // Cart buttons (Add to cart btn)
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        // get product from products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        // add product to the cart
        cart = [...cart, cartItem];
        Storage.saveCart(cart);
        this.setCartValues(cart);
        this.addCartItem(cartItem);
        this.showCart();
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }
  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img src=${item.image} />
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

  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }
  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }

  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }

  cartLogic() {
    // clear cart btn
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });
    // cart functionality
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }

  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));

    while (cartContent.children.length > 0) {
      let removeItem = cartContent.children[0];
      cartContent.removeChild(removeItem);
    }
    this.hideCart();
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    if (button) {
      button.disabled = false;
      button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
    }
  }

  getSingleButton(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
  }
}

///////////////////////////////////////////////////////////
// local storage

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  // setup app
  ui.setupAPP();
  // get all products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();

      filter(".card-filter", ".product");
      filterPrice(".card-price", ".product");
    });
});

///////////////////////////////////////////////////////////
// Filter

function filter(input, selector) {
  document.addEventListener("keyup", (e) => {
    if (e.target.matches(input)) {
      if (e.key === "Escape") e.target.value = "";

      document
        .querySelectorAll(selector)
        .forEach((el) =>
          el.textContent.toLowerCase().includes(e.target.value)
            ? el.classList.remove("filter")
            : el.classList.add("filter")
        );
    }
  });
}

///////////////////////////////////////////////////////////
// Filter Price

function filterPrice(input, selector) {
  const inputElement = document.querySelector(input);

  if (!inputElement) {
    return;
  }

  // keyup event
  inputElement.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
      inputElement.value = "";
    }

    filterElements();
  });

  document.addEventListener("click", (e) => {
    if (e.target.matches(input)) {
      filterElements();
    }
  });

  // Filter elements
  function filterElements() {
    document.querySelectorAll(selector).forEach((el) => {
      el.textContent.toLowerCase().includes(inputElement.value.toLowerCase())
        ? el.classList.remove("filter")
        : el.classList.add("filter");
    });
  }
}

///////////////////////////////////////////////////////////
// Footer date

// Set Current Year
const year = document.querySelector(".year");
const currentYear = new Date().getFullYear();
year.textContent = currentYear;

document.addEventListener("DOMContentLoaded", function () {
  const showCartValue = sessionStorage.getItem("showCart");
  if (showCartValue === "true") {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
    sessionStorage.removeItem("showCart");
  }
});
