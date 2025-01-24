import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import '../data/cart.js'; 
import { loadProductsFetch } from "../data/products.js";
import { loadCartFetch } from "../data/cart.js";


async function loadPage() {
  try {
    //throw 'error';

    await Promise.all([

      loadProductsFetch(),
      loadCartFetch()
  
    ]);

    /*
    const value = await new Promise((resolve, reject) => {
      // throw 'error2';
      loadCartFetch(() => {
        // reject('error3');
        resolve('value2');
      });
    });
    */

  } catch (error) {
    console.log(error);
    console.log('unexpected error. Please try again later.');
  } 

  renderOrderSummary();
  renderPaymentSummary();

  //return 'value2';
}

loadPage();//.then((value) => {
  //console.log(value);
  //console.log('next step');
//});

/*
//array of promises. 
Promise.all([
  loadProductsFetch(),

  new Promise((resolve) => {
    loadCart(() => {
      resolve('value2');
    });
  })

]).then(() => {
  // console.log(value);

  renderOrderSummary();
  renderPaymentSummary();
});

// new Promise((resolve) => {
//   loadProducts(() => {
//     resolve('value1');
//   });

// }).then((value) => {
//   console.log(value);

//   return new Promise((resolve) => {
//     loadCart(() => {
//       resolve();
//     });
//   });

// }).then(() => {
//   renderOrderSummary();
//   renderPaymentSummary();
// });
*/
