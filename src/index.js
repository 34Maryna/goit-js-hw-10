import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
   searchInput:document.querySelector('#search-box'),
   countryList:document.querySelector('.country-list'),
   countryInfo:document.querySelector('.country-info'), 
};

refs.searchInput.addEventListener('input', debounce(handleSearch, DEBOUNCE_DELAY));

function handleSearch(evt) {
    const search = evt.target.value.trim();
    if(search === '') {
        refs.countryInfo.innerHTML = '';
        refs.countryList.innerHTML = '';
        return;
    }
fetchCountries(search).then(countryMarkup).catch(error);
}

function countryMarkup(countries) {
if(countries.length > 10) {
    Notify.info("Too many matches found. Please enter a more specific name.");
    refs.countryList.textContent = '';
} else if (countries.length > 2 && countries.length < 10) {
    const listMarkUp = countries
    .map(country => {
        return `<li> <img src="${country.flags.svg}" alt="${country.name.official}" width="40px""><span>${country.name.official}</span></li>`;
    })
    .join('');
    refs.countryList.innerHTML = listMarkUp;
    refs.countryInfo.innerHTML = '';
    } else if (countries.length === 1) {
    const createMarkup = countries
    .map(country => {
        const languages = Object.values(country.languages).join(', ');
        return `<p><b>Capital:</b> ${country.capital}</p><p><b>Population:</b> ${country.population}</p><p><b>Languages:</b> ${languages}</p>`;
    })
.join('');
const listMarkUp = countries
.map(country => {
    return `<li> <img src="${country.flags.svg}" alt="${country.name.official}" width="40px""> ${country.name.official}</li>`;
})
.join('');
refs.countryInfo.innerHTML = createMarkup;
refs.countryList.innerHTML = listMarkUp;
}
}

function error() {
    Notify.failure('Oops, there is no country with that name');
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
