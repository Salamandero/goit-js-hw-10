import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './fetchCountries.js';

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

var debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

searchInput.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(e) {
  e.preventDefault();
  let countryName = searchInput.value.trim();
  if (searchInput.value === '') {
    return createMarkup('', '');
  } 
    fetchCountries(countryName).then(data => {
      if (data.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        createMarkup('', '');
        return;
        } if (data.length > 1) {
          // createCountryListMarkup(data);
          // countryInfo.innerHTML = '';
          createMarkup(createCountryListMarkup(data),'');
        } else {
          // countryList.innerHTML = '';
          // createInfoMarkup(...data);
          createMarkup('', createInfoMarkup(...data))
        }
      })
      .catch(error => {
        // Notify.failure('Oops, there is no country with that name!');
        console.log('error in catch', error);
      });
}
function createMarkup (innerList, innerInfo){
  countryList.innerHTML = innerList;
  countryInfo.innerHTML = innerInfo;
}

function createListMarkup(array) {
  return `<li class="country-list__item">
    <img class="country-list__flags" src="${array.flags.svg}" alt="${array.name.official}" width=30 height=20>
    <p class="country-list__name">${array.name.official}</p>
  </li>`;
}
function createCountryListMarkup(arrays) {
  const result = arrays.reduce((acc, array) => acc + createListMarkup(array), '');
  return countryList.innerHTML = result;
}

function createInfoMarkup(array) {
  return `<h2 class="country-info__title">
      <img class="country-info__flag" src="${array.flags.svg}" alt="${
    array.name.official
  }" width=50 height=30 />
      ${array.name.official}
    </h2>
    <ul class="country-info__list">
      <li class="country-info__item"><span class="country-info__text">Capital:</span> ${
        array.capital
      }</></li>
      <li class="country-info__item"><span class="country-info__text">Population:</span> ${
        array.population
      }</></li>
      <li class="country-info__item"><span class="country-info__text">Languages:</span> ${Object.values(
        array.languages
      )}</></li>
    </ul>`;
}
