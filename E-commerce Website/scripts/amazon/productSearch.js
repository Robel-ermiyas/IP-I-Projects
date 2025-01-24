function productSearch () {

  document.querySelector('.js-search-button')
  .addEventListener('click', () => {

    const search = document.querySelector('.js-search-bar').value;

    if (search != '') {
      window.location.href = `homePage.html?search=${search}`
    } else {
      window.location.href = `homePage.html`
    }

  });

  /*
  document.querySelector('.js-search-button')
    .addEventListener('click', () => {
      const search = document.querySelector('.js-search-bar').value;
      window.location.href = `amazon.html?search=${search}`;
    });
  */
  
document.querySelector('.js-search-bar')
  .addEventListener('keydown', (event) => {

    const search = document.querySelector('.js-search-bar').value;


    if (event.key === 'Enter') {
      const input = event.target; // Use 'event.target' to reference the input
      if (search != '') {
        window.location.href = `homePage.html?search=${search}`;
      } else {
        window.location.href = `homePage.html`;
      }
    }
  });
}


export default productSearch;



