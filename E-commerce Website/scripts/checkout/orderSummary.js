/*import { cart } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import formatCurrency from "../utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption, calculateDeliveryDate } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import renderCheckoutHeader from "./checkoutHeader.js";

export function renderOrderSummary () {
  let cartSummaryHTML = '';

  cart.cartItems.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
    
    <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name js-product-name-${matchingProduct.id}">
            ${matchingProduct.name}
          </div>
          <div class="product-price js-product-price-${matchingProduct.id}">
            ${matchingProduct.getPrice()}
          </div>
          <div class="product-quantity js-product-quantity-${matchingProduct.id}">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link js-update-link js-update-link-${matchingProduct.id} link-primary" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input js-quantity-input-${matchingProduct.id}" type="number">
            <span class="save-quantity-link js-save-link js-save-quantity-${matchingProduct.id} link-primary" data-product-id="${matchingProduct.id}">Save</span>
            <span class="delete-quantity-link js-delete-link-${matchingProduct.id} link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
    
    `;
  });

  function deliveryOptionsHTML (matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const dateString = calculateDeliveryDate(deliveryOption);
      const priceString = deliveryOption.priceCents
      === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `

      <div class="delivery-option js-delivery-option js-delivery-option-${matchingProduct.id}-${deliveryOption.id}" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input js-delivery-option-input-${matchingProduct.id}-${deliveryOption.id}"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} - Shipping
          </div>
        </div>
      </div>

      `;
    });

    return html;
  }

  if (cartSummaryHTML) {
    document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;
  } else {
    document.querySelector('.js-order-summary')
    .innerHTML = `
    
    <div class="empty-cart" data-testid="empty-cart-message">
      Your cart is empty.
    </div>
    <div>
      <a class="button-primary view-products-link" href="amazon.html">
        View products
      </a>
    </div>

    
    `;
  }

  document.querySelectorAll('.js-delete-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        cart.removeFromCart(productId);
        // const container = document.querySelector(
        //   `.js-cart-item-container-${productId}`
        // );

        // container.remove(); //remove from the page 
        // calculateCartQuantity(document.querySelector(
        //   '.js-checkout-header-middle-section'), 'checkout');
        renderCheckoutHeader();
        renderOrderSummary();
        renderPaymentSummary();
      }); 
    });

  // calculateCartQuantity(document.querySelector(
  //   '.js-checkout-header-middle-section'), 'checkout');

  renderCheckoutHeader();

  document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const {productId} = link.dataset;

        const container = document.querySelector(`.js-cart-item-container-${productId}`);

        const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);

        const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);

        const quantity = quantityLabel.innerHTML;

        container.classList.add('is-editing-quantity');

        quantityInput.value = quantity;
      });
    });


  document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      const updateCart = () => {
      const {productId} = link.dataset;

      const container = document.querySelector(`.js-cart-item-container-${productId}`);

      container.classList.remove('is-editing-quantity');

      const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);

      const newQuantity = Number(quantityInput.value);

      if (newQuantity < 0 || newQuantity >= 1000) {
        alert('Quantity must be at least 0 and less than 1000');
        return;
      } else if (!newQuantity) {
          removeFromCart(productId);

          // const container = document.querySelector(
          //   `.js-cart-item-container-${productId}`
          // );
    
          // container.remove(); //remove from the page 
          renderOrderSummary();
          renderPaymentSummary();
          renderCheckoutHeader();
          return;
        }

        cart.updateQuantity(productId, newQuantity);

        const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);

        quantityLabel.innerHTML = newQuantity;

        // calculateCartQuantity(document.querySelector(
        //   '.js-checkout-header-middle-section'), 'checkout');
        renderCheckoutHeader();

        renderOrderSummary();
        renderPaymentSummary();
      };
      link.addEventListener('click', updateCart);
      const {productId} = link.dataset;

      const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
      quantityInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          updateCart();
        }
      });
    });

    document.querySelectorAll('.js-delivery-option')
      .forEach((element) => {
        const {productId, deliveryOptionId} = element.dataset;
        element.addEventListener('click', () => {
          cart.updateDeliveryOption(productId, deliveryOptionId);
          renderOrderSummary(); //recursion
          renderPaymentSummary();
        });
      });
    }

  // document.querySelectorAll('.js-update-link')
  // .forEach((link) => {
  //   const productId = link.dataset.productId;
  //   link.addEventListener('click', () => { 
      //set the save link and quantity input display to initial and set the display for the update link to none
  //     const saveQuantityLink = document.querySelector(`.js-save-quantity-${productId}`);
  //     const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
  //     const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
  //     const quantity = quantityLabel.innerHTML

  //     saveQuantityLink.classList.add('save-quantity-link--modifier');
  //     quantityInput.classList.add('quantity-input--modifier');
  //     quantityLabel.innerHTML = '';
  //     link.classList.add('update-quantity-link--modifier');

  //     quantityInput.value = quantity;
  //   });
  // });


// document.querySelectorAll('.js-save-quantity-link')
//   .forEach((link) => {
//     const {productId} = link.dataset;

//     link.addEventListener('click', () => {
      //set the update link display to initial and set the display for the save link and quantity input to none and get the input value and 
      // const updateLink = document.querySelector(`.js-update-link-${productId}`);
      // const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
      // const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
      // const quantity = Number(quantityInput.value);

      // if (quantity < 0) {
      //   alert('Not a valid quantity');
      //   return;
      // } else if (!quantity) {
      //   removeFromCart(productId);

      //   const container = document.querySelector(
      //     `.js-cart-item-container-${productId}`
      //   );
  
      //   container.remove(); //remove from the page  
  //       calculateCartQuantity(document.querySelector(
  //         '.js-checkout-header-middle-section'), 'checkout');
  //       return;
  //     }

  //     updateLink.classList.remove('update-quantity-link--modifier');
  //     quantityInput.classList.remove('quantity-input--modifier');
  //     link.classList.remove('save-quantity-link--modifier');

  //     let matchingCartItem = matchingItem(productId);

  //     if (matchingCartItem) {
  //       matchingCartItem.quantity = quantity;
  //     }

  //     quantityLabel.innerHTML = matchingCartItem.quantity;


  //     calculateCartQuantity(document.querySelector(
  //       '.js-checkout-header-middle-section'), 'checkout');

  //     saveToStorage();
  //   });
  // });
*/
import { cart } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import formatCurrency from "../utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption, calculateDeliveryDate } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import renderCheckoutHeader from "./checkoutHeader.js";

export function renderOrderSummary() {
  let cartSummaryHTML = '';

  cart.cartItems.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);
    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name js-product-name-${matchingProduct.id}">
              ${matchingProduct.name}
            </div>
            <div class="product-price js-product-price-${matchingProduct.id}">
              ${matchingProduct.getPrice()}
            </div>
            <div class="product-quantity js-product-quantity-${matchingProduct.id}">
              <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link js-update-link js-update-link-${matchingProduct.id} link-primary" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input class="quantity-input js-quantity-input-${matchingProduct.id}" type="number" style="display:none;">
              <span class="save-quantity-link js-save-link js-save-quantity-${matchingProduct.id} link-primary" data-product-id="${matchingProduct.id}" style="display:none;">Save</span>
              <span class="delete-quantity-link js-delete-link-${matchingProduct.id} link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach((deliveryOption) => {
      const dateString = calculateDeliveryDate(deliveryOption);
      const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;
      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-option js-delivery-option js-delivery-option-${matchingProduct.id}-${deliveryOption.id}" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
          <input type="radio" ${isChecked ? 'checked' : ''} class="delivery-option-input js-delivery-option-input-${matchingProduct.id}-${deliveryOption.id}" name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">${dateString}</div>
            <div class="delivery-option-price">${priceString} - Shipping</div>
          </div>
        </div>
      `;
    });

    return html;
  }

  if (cartSummaryHTML) {
    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
  } else {
    document.querySelector('.js-order-summary').innerHTML = `
      <div class="empty-cart" data-testid="empty-cart-message">
        Your cart is empty.
      </div>
      <div>
        <a class="button-primary view-products-link" href="amazon.html">View products</a>
      </div>
    `;
  }

  // Event listener for deleting items
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      cart.removeFromCart(productId);
      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  renderCheckoutHeader();

  // Event listener for updating quantities
  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const { productId } = link.dataset;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
      const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);

      const quantity = quantityLabel.innerHTML;
      container.classList.add('is-editing-quantity');

      quantityInput.value = quantity;
      quantityInput.style.display = 'inline'; // Show input
      quantityLabel.style.display = 'none'; // Hide label
      const saveLink = document.querySelector(`.js-save-link.js-save-quantity-${productId}`);
      saveLink.style.display = 'inline'; // Show Save link
      link.style.display = 'none'; // Hide Update link
    });
  });

  // Event listener for saving updated quantities
  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      const { productId } = link.dataset;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.remove('is-editing-quantity');

      const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
      const newQuantity = Number(quantityInput.value);

      if (newQuantity < 0 || newQuantity >= 1000) {
        alert('Quantity must be at least 0 and less than 1000');
        return;
      } else if (!newQuantity) {
        cart.removeFromCart(productId);
        renderOrderSummary();
        renderPaymentSummary();
        renderCheckoutHeader();
        return;
      }

      cart.updateQuantity(productId, newQuantity);
      const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
      quantityLabel.innerHTML = newQuantity;

      const saveLink = document.querySelector(`.js-save-link.js-save-quantity-${productId}`);
      saveLink.style.display = 'none'; // Hide Save link
      const updateLink = document.querySelector(`.js-update-link[data-product-id="${productId}"]`);
      updateLink.style.display = 'inline'; // Show Update link

      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  // Event listener for delivery option selection
  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    const { productId, deliveryOptionId } = element.dataset;
    element.addEventListener('click', () => {
      cart.updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}

