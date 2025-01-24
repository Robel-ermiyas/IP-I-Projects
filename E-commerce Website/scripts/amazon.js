import {cart} from '../data/cart.js';
import {products, loadProductsFetch, getProduct} from '../data/products.js';
import renderCartQuantity from './amazon/cartQuantity.js';
import productSearch from './amazon/productSearch.js';

// loadProducts(renderProductsGrid);

async function renderProductsGrid() {
  let productsHTML = '';

  await loadProductsFetch();

  renderCartQuantity();

  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');

  let filteredProducts = products;

  // If a search exists in the URL parameters,
  // filter the products that match the search.
  if (search) {
    filteredProducts = products.filter((product) => {
      const name = product.name.toLowerCase();

      return name.includes(search.toLocaleLowerCase());

      /*
      let matchingKeyword = false;

      product.keywords.forEach((keyword) => {
        if (keyword.toLowerCase().includes(search.toLowerCase())) {
          matchingKeyword = true;
        }
      });

      return matchingKeyword ||
        product.name.toLowerCase().includes(search.toLowerCase());
        */
    });
  }

  filteredProducts.forEach((product) => {
    productsHTML += `
      <div class="product-container" data-product-id="${product.id}">
        <div class="product-image-container">
          <img class="js-product-image product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${product.getStarsUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${product.extraInfoHTML()}

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart"
        data-product-id="${product.id}" data-product-name="${product.name}">
          Add to Cart
        </button>
      </div>
    `;
  });

  if (filteredProducts === undefined || filteredProducts.length == 0) {
    document.querySelector('.js-products-grid')
      .innerHTML = '<div class="empty-results-message"> No products matched your search. </div>';

    return productSearch();

  }

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  /*
  function updateCartQuantity() {
    let cartQuantity = 0;
    cart.cartItems.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
    document.querySelector('.js-cart-quantity')
      .innerHTML = cartQuantity;
  }
  */

  document.querySelectorAll('.js-add-to-cart')
    .forEach((button) => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
        const selectorValue = Number(quantitySelector.value);

        cart.addToCart(productId, selectorValue);
        renderCartQuantity();
      });
  });

  function turnOffPreviousButton () {
    const previousButton = document.querySelector('.is-selected');
    previousButton && previousButton.classList.remove('is-selected');
  }
  
  document.querySelectorAll('.js-variation-option').forEach((button) => {
    button.addEventListener('click', () => {
      const color = button.innerHTML.toLowerCase();
      const checkButton = button.classList;
      const product = getProduct(button.dataset.productId);

      if (!checkButton.contains('is-selected')){
        turnOffPreviousButton();
        checkButton.add('is-selected');
      }

      product.image = `images/products/variations/adults-plain-cotton-tshirt-2-pack-${color}.jpg`

      console.log(product);
  });


  });



  productSearch();

}

renderProductsGrid();

/*
import { cart} from '../data/cart.js';
import { products, loadProducts } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import renderCartQuantity from './amazon/cartQuantity.js';
import './amazon/productSearch.js';



new Promise((resolve) => {
  loadProducts(() => {
    resolve('value1');
  });
}).then((value) => {
  // console.log(value);
  renderProductsGrid();
});

export function renderProductsGrid() {

  let productsHTML = '';

  renderCartQuantity();

  products.forEach((product) => {
    const url = new URL(window.location.href);
    const word = url.searchParams.get('search') || '';
    const name = product.name.toLowerCase();

    if (name.includes(word.toLowerCase())) {
      productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="${product.getStarsUrl()}">
          <div class="product-rating-count link-primary">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ${product.getPrice()}
        </div>

        <div class="product-quantity-container">
          <select class="js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        ${product.extraInfoHTML()}

        <div class="product-spacer"></div>

        <div class="added-to-cart js-added-to-cart-${product.id}">
          <img src="images/icons/checkmark.png">
          Added
        </div>

        <button class="add-to-cart-button button-primary js-add-to-cart"
        data-product-id="${product.id}" data-product-name="${product.name}">
          Add to Cart
        </button>
      </div>
    `;
    }

  });

  if (productsHTML === '') {
    productsHTML += '<div class="empty-results-message"> No products matched your search. </div>'
  }

  document.querySelector('.js-products-grid')
    .innerHTML = productsHTML;

  // gives a list of all the add to cart's button on the page
  document.querySelectorAll('.js-add-to-cart')
    .forEach((button) => {
      button.addEventListener('click', () => {
        //dataset gives us all the data attributes that are attach to the buttons
        const {productId} = button.dataset;
        const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
        const selectorValue = Number(quantitySelector.value);

        cart.addToCart(productId, selectorValue);
        renderCartQuantity();  
      });
    });
}
*/

