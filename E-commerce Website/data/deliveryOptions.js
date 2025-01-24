import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export const deliveryOptions = [{
  id: '1',
  deliveryDays: 7,
  priceCents: 0
},
{
  id: '2',
  deliveryDays: 3,
  priceCents: 499
},
{
id: '3',
deliveryDays: 1,
priceCents: 999
}];

export function getDeliveryOption(deliveryOptionId) {
  let deliveryOption;

  deliveryOptions.forEach((option) => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
    }
  });

  return deliveryOption || deliveryOptions[0];
}

function isWeekend(date) {
  const dayOfWeek = date.format('dddd');
  return dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
}

export function calculateDeliveryDate(deliveryOption) {
  let remainingDays = deliveryOption.deliveryDays;
  let deliveryDate = dayjs();

  while (remainingDays > 0) {
    deliveryDate = deliveryDate.add(1, 'day'); //add 1 to deliveryDate

    if (!isWeekend(deliveryDate)) {
      remainingDays--;
    }
  }
  const dateString = deliveryDate.format(
    'dddd, MMMM D'
  );
  return dateString;
}

export function deliveryOptionExist(deliveryOptionId) {
  let result = false;
  deliveryOptions.forEach((option) => {
    if(option.id === deliveryOptionId) {
      result = true;
    }
  })
  return result;
}

// export function calculateDeliveryDate(deliveryOption) {
//   const today = dayjs();
//   const {deliveryDays} = deliveryOption;
//   let newDeliveryDays = 0;
//   let days = 0;



//   while (days != deliveryDays) { 
//     let deliveryDate = today.add(newDeliveryDays, 'days');
    
//     console.log(`${deliveryDate.format('dddd, MMMM D')} newDeliveryDays${newDeliveryDays}`);


//     if (!isWeekend(deliveryDate)) {
//       newDeliveryDays++
//       days++
//     } else {
//       newDeliveryDays++
//       continue;
//     }
//   }

//   console.log(newDeliveryDays);
//   return today.add(newDeliveryDays, 'days');
// }
