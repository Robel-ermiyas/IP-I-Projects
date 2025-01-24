import {getOrder} from '../data/orders.js';
import {getProduct, loadProductsFetch} from '../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import renderCartQuantity from './amazon/cartQuantity.js';
import productSearch from './amazon/productSearch.js';

async function loadPage() {
  await loadProductsFetch();

  renderCartQuantity();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  const order = getOrder(orderId);
  const product = getProduct(productId);

  // Get additional details about the product like
  // the estimated delivery time.
  let productDetails;
  order.products.forEach((details) => {
    if (details.productId === product.id) {
      productDetails = details;
    }
  });

  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
  const percentProgress = ((today - orderTime) / (deliveryTime - orderTime)) * 100;

  const deliveredMessage = today < deliveryTime ? 'Arriving on' : 'Delivered on';


  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>
    <div class="delivery-date">
    ${deliveredMessage} ${
        dayjs(productDetails.estimatedDeliveryTime).format('dddd, MMMM D')
      }
    </div>
    <div class="product-info">
      ${product.name}
    </div>
    <div class="product-info">
      Quantity: ${productDetails.quantity}
    </div>
    <img class="product-image" src="${product.image}">
    <div class="progress-labels-container">
      <div class="progress-label ${
        percentProgress < 50 ? 'current-status' : ''
      }">
        Preparing
      </div>
      <div class="progress-label ${
        (percentProgress >= 50 && percentProgress < 100) ? 'current-status' : ''
      }">
        Shipped
      </div>
      <div class="progress-label ${
        percentProgress >= 100 ? "current-status" : ''
      }">
        Delivered
      </div>
    </div>
    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentProgress}%;"></div>
    </div>
  `;

  document.querySelector('.js-order-tracking').innerHTML = trackingHTML;

  productSearch();

}

loadPage();


/*
import { getOrder } from "../data/orders.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import { formattedDate } from "./utils/formatDate.js"; 
import renderCartQuantity from "./amazon/cartQuantity.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';


renderCartQuantity();

let trackingPageHTML = '';

async function renderTrackingPage() {
  await loadProductsFetch();

  try {
    const url = new URL(window.location.href);
    const order = getOrder(url.searchParams.get('orderId'));
    const cartItemId = url.searchParams.get('cartItemId');
    const productId = getProduct(cartItemId);
    const dateFormat = { weekday: 'long', month: 'long', day: 'numeric' };
  
    let matchingProduct;
  
    order.products.forEach((product) => {
  
      if (product.productId === cartItemId) {
        matchingProduct = product;
      }
  
    });
  
  
    const deliveryDate = matchingProduct.estimatedDeliveryTime;
    const quantity = matchingProduct.quantity
    const today = dayjs();
    const orderTime = dayjs(order.orderTime);
    const deliveryTime = dayjs(deliveryDate);
    const percentProgress = ((today - orderTime) / (deliveryTime - orderTime)) * 100;
  
  
    trackingPageHTML += `
    
    <a class="back-to-orders-link link-primary" href="orders.html">
    View all orders
    </a>
  
    <div class="delivery-date">
      Arriving on ${formattedDate(deliveryDate, 'en-US', dateFormat)}
    </div>
  
    <div class="product-info">
      ${productId.name}
    </div>
  
    <div class="product-info">
      Quantity: ${quantity}
    </div>
  
    <img class="product-image" src="${productId.image}">
  
    <div class="progress-labels-container">
      <div class="progress-label ${ percentProgress < 50 ? 'current-status' : ''}">
        Preparing
      </div>
      <div class="progress-label ${ (percentProgress >= 50 && percentProgress < 100) ? 'current-status' : ''}">
        Shipped
      </div>
      <div class="progress-label ${ percentProgress >= 100 ? 'current-status' : ''}">
        Delivered
      </div>
    </div>
  
    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentProgress}%;"></div>
    </div>
    
    `
  
    document.querySelector('.js-order-tracking')
      .innerHTML = trackingPageHTML;

  } catch {
    trackingPageHTML += 'Tracking information not found.';

    document.querySelector('.js-order-tracking')
    .innerHTML = trackingPageHTML;
  }

}

renderTrackingPage();
*/
