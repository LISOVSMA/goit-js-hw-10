//Створи фронтенд частину програми пошуку даних про країну за її частковою або повною назвою.
//Використовуй публічний API Rest Countries v2, а саме ресурс name, який повертає масив об'єктів країн, що задовольнили критерій пошуку.
//Необхідно застосувати прийом Debounce на обробнику події і робити HTTP-запит через 300мс після того, як користувач перестав вводити текст.
//Виконай санітизацію введеного рядка методом trim(), це вирішить проблему, коли в полі введення тільки пробіли, або вони є на початку і в кінці рядка.

import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputEl = document.getElementById('search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const country = e.target.value.trim();

  clearMarkup(countryInfoEl);
  clearMarkup(countryListEl);

  if (!country) {
    e.target.value = '';
    clearMarkup(countryInfoEl);
    clearMarkup(countryListEl);
    return;
  }

  fetchCountries(country)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (!data.length) {
        clearMarkup(countryInfoEl);
        clearMarkup(countryListEl);
        Notiflix.Notify.failure('Oops, there is no country with that name');
      } else {
        createMarkup(data);
      }
    })
    .catch(error => {
      clearMarkup(countryInfoEl);
      clearMarkup(countryListEl);
      if (error.message === '404') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    });
}

function createMarkup(data) {
  if (data.length === 1) {
    const markup = data.reduce(
      (markup, country) => markup + createMarkupOneCountry(country),
      ''
    );
    clearMarkup(countryListEl);
    countryInfoEl.innerHTML = markup;
  } else {
    const list = data.reduce(
      (markup, country) => markup + createMarkupCountries(country),
      ''
    );
    clearMarkup(countryInfoEl);
    countryListEl.innerHTML = list;
  }
}

function createMarkupCountries({ name, flags }) {
  return `<li><img src =${flags.svg} alt='flags of ${name.official}' width=60 height=40/><p>${name.official}</p></li>`;
}

function createMarkupOneCountry({
  name,
  capital,
  population,
  flags,
  languages,
}) {
  return `<img src =${flags.svg} alt='flags of ${
    name.official
  }' width=100% height=120/> <p>${name.official}</p>
	<ul class="porps"><li>Capital: ${capital}</li><li>Population: ${population}</li><li>Languages: ${Object.values(
    languages
  )}</li>
	</ul>`;
}

function clearMarkup(element) {
  return (element.innerHTML = '');
}
