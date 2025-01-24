import { cart } from "../../data/cart.js";

function renderCheckoutHeader () {
  let cartQuantity = 0;
  let checkoutHeaderHTML = '';

  cart.cartItems.forEach((cartItem) => {
    cartQuantity += cartItem.quantity
  });

  checkoutHeaderHTML += `
  
  Checkout (<a class="return-to-home-link"
  href="homePage.html">${cartQuantity} items</a>)

  `;

  document.querySelector('.js-checkout-header-middle-section')
    .innerHTML = checkoutHeaderHTML;
}


export default renderCheckoutHeader;
