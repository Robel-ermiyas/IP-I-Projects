import {getProduct, loadProductsFetch} from '../data/products.js';
import {orders} from '../data/orders.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import formatCurrency from './utils/money.js';
import { cart } from '../data/cart.js';
import renderCartQuantity from './amazon/cartQuantity.js';
import productSearch from './amazon/productSearch.js';

async function loadPage() { 
  await loadProductsFetch();

  let ordersHTML = '';

  renderCartQuantity();

  orders.forEach((order) => {
    const orderTimeString = dayjs(order.orderTime).format('MMMM D');

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${orderTimeString}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        <div class="order-details-grid">
          ${productsListHTML(order)}
        </div>
      </div>
    `;

  });

  function productsListHTML (order) {
    let productsListHTML = '';

    order.products.forEach((productDetails) => {
      const product = getProduct(productDetails.productId);

      productsListHTML += `
        <div class="product-image-container">
          <img src="${product.image}">
        </div>
        <div class="product-details">
          <div class="product-name">
            ${product.name}
          </div>
          <div class="product-delivery-date">
            Arriving on: ${
              dayjs(productDetails.estimatedDeliveryTime).format('MMMM D')
            }
          </div>
          <div class="product-quantity">
            Quantity: ${productDetails.quantity}
          </div>
          <button class="buy-again-button button-primary js-buy-again" data-product-id="${product.id}" data-order-id="${order.id}">
            <img class="buy-again-icon" src="images/icons/buy-again.png">
            <span class="buy-again-message">Buy it again</span>
            <span class="buy-again-success">✓ Added</span>
          </button>
        </div>
        <div class="product-actions">
          <a href="tracking.html?orderId=${order.id}&productId=${product.id}">
            <button class="track-package-button button-secondary">
              Track package
            </button>
          </a>
        </div>
      `;
    });

    return productsListHTML;
  }

  document.querySelector('.js-orders-grid').innerHTML = ordersHTML;

  const addedMessageTimeouts = {};

  document.querySelectorAll('.js-buy-again').forEach((button) => {
    button.addEventListener('click', () => {
      const orderId = button.dataset.orderId;
      const productId = button.dataset.productId;
      const prevMessageTimeouts = addedMessageTimeouts[orderId];

      // Clear any existing timeout for this product
      if (prevMessageTimeouts && prevMessageTimeouts[productId]) {
        clearTimeout(prevMessageTimeouts[productId]);
      }

      // Add the class to show the success message
      button.classList.add('is-buying-again');

      // Set a new timeout to remove the class after 2 seconds
      addedMessageTimeouts[orderId] = {
        [productId]: setTimeout(() => {
          button.classList.remove('is-buying-again');

          delete addedMessageTimeouts[orderId][productId];
        }, 2000)
      };

      // Next, add the order to the cart and save to storage
      cart.addToCart(productId);

      renderCartQuantity();

    });
  });

  productSearch();  
}

loadPage();



/*
import { orders } from "../data/orders.js";
import { formatCurrency } from "./utils/money.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import { formattedDate } from "./utils/formatDate.js";
import { cart } from "../data/cart.js";
import renderCartQuantity from "./amazon/cartQuantity.js";
import './amazon/productSearch.js';


renderCartQuantity();

let ordersHTML = '';

async function renderOrdersGrid() {
  // Load products before rendering orders
  await loadProductsFetch();

  for (const order of orders) {
    const orderDate = order.orderTime;
    const productsHTML = await orderedProductsHTML(order);

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${formattedDate(orderDate)}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        <div class="order-details-grid">
          ${productsHTML}
        </div>
      </div>
    `;
  }

  document.querySelector('.js-orders-grid').innerHTML = ordersHTML;


  // for(const order of orders) {
  //   for(const productOrder of order.products) {

  //   }
  // }

  const addedMessageTimeouts = {};

  document.querySelectorAll('.js-buy-again-button').forEach((button) => {
    button.addEventListener('click', () => {
      const orderId = button.dataset.orderId;
      const productId = button.dataset.productId;
      const prevMessageTimeouts = addedMessageTimeouts[orderId];

      // Clear any existing timeout for this product
      if (prevMessageTimeouts && prevMessageTimeouts[productId]) {
        clearTimeout(prevMessageTimeouts[productId]);
      }

      // Add the class to show the success message
      button.classList.add('is-buying-again');

      // Set a new timeout to remove the class after 2 seconds
      addedMessageTimeouts[orderId] = {
        [productId]: setTimeout(() => {
          button.classList.remove('is-buying-again');

          delete addedMessageTimeouts[orderId][productId];
        }, 2000)
      };

      // Next, add the order to the cart and save to storage
      cart.addToCart(productId);

      renderCartQuantity();

    });
  });
}

async function orderedProductsHTML(order) {
  let productsHTML = '';

  for (const productOrder of order.products) {
    const productOrderId = productOrder.productId;
    const expectedDeliveryDate = productOrder.estimatedDeliveryTime;
    const quantity = productOrder.quantity;
    const product = getProduct(productOrderId);

    productsHTML += `
      <div class="product-image-container">
        <img src="${product.image}">
      </div>
      <div class="product-details">
        <div class="product-name">
          ${product.name}
        </div>
        <div class="product-delivery-date">
          Arriving on: ${formattedDate(expectedDeliveryDate)}
        </div>
        <div class="product-quantity">
          ${quantity}
        </div>
        <button class="buy-again-button button-primary js-buy-again-button" data-order-id="${order.id}" data-cart-item-id="${productOrderId}">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
          <span class="buy-again-success">✓ Added</span>
        </button>
      </div>
      <div class="product-actions">
        <a href="tracking.html?orderId=${order.id}&productId=${productOrderId}">
          <button class="track-package-button button-secondary" onclick="console.log(${expectedDeliveryDate});">
            Track package
          </button>
        </a>
      </div>
    `;
  }

  return productsHTML;
}

renderOrdersGrid();

*/
