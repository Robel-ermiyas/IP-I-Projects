import { cart } from "../../data/cart.js";

function renderCartQuantity () {
  let cartQuantity = 0;
  let cartQuantityHTML = '';

  cart.cartItems.forEach((cartItem) => {
    cartQuantity += cartItem.quantity
  });

  cartQuantityHTML += `${cartQuantity}`;

  document.querySelector('.js-cart-quantity')
    .innerHTML = cartQuantityHTML;
}

export default renderCartQuantity;
