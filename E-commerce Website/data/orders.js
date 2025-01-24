export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

export function getOrder(orderId) {
  return orders.find(order => order.id === orderId);
}

/*
// export function getOrder(orderId) {
//   let matchingOrder;

//   orders.forEach((order) => {
//     if (order.id === orderId) {
//       matchingOrder = order;
//     }
//   });

//   return matchingOrder;
// }

// export function getOrder(orderId) {
//   let matchingOrder;

//   for (const order of orders) {
//     if (order.id === orderId) {
//       matchingOrder = order;
//     }
//   }

//   return matchingOrder;
// }
*/


