// export function formattedDate(day) {
//   const dateString = day;
//   const date = new Date(dateString);
//   const options = { month: 'long', day: 'numeric' };
//   const formattedDate = date.toLocaleDateString('en-US', options);

//   return formattedDate;
// }

export function formattedDate(day, locale = 'en-US', options = { month: 'long', day: 'numeric' }) {
  const date = new Date(day);
  return date.toLocaleDateString(locale, options);
}
