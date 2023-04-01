'use strict'

import { fetchData, url } from "./api.js"
import * as module from './module.js'
  ;

/**
 * 
 * @param {nodeList} elements Element node array 
 * @param {string} eventType event type e.g.: 'click', 'mouseover', etc..  
 * @param {function} callback callback function 
 */
const addEventOnElement = function (elements, eventType, callback) {
  elements.forEach(element => {
    element.addEventListener(eventType, callback);
  })
};

// Toggle search on mobile 
const searchView = document.querySelector('[data-search-view]');
const searchTogglers = document.querySelectorAll('[data-search-toggler]');

const toggleSearch = () => searchView.classList.toggle('active');
addEventOnElement(searchTogglers, 'click', toggleSearch);


// SEARCH INTEGRATION
const searchField = document.querySelector('[data-search-field]');
const searchResult = document.querySelector('[data-search-result]');

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchField.addEventListener('input', function () {

  searchTimeout ?? clearTimeout(searchTimeout);

  if (!searchField.value) {
    searchResult.classList.remove('active');
    searchResult.innerHTML = '';
    searchField.classList.remove('searching');
  } else {
    searchField.classList.add('searching');
  }

  if (searchField.value) {

    searchTimeout = setTimeout(async () => {

      const locations = await fetchData(url.geo(searchField.value))

      console.log(locations);

      searchField.classList.remove('searching');
      searchResult.classList.add('active');
      searchResult.innerHTML = `
        <ul class="view-list" data-search-list></ul>
      `;

      const /**{NodeList} | [] */ items = [];

      locations.forEach(({ name, lat, lon, country, state }) => {
        const searchItem = document.createElement('li');
        searchItem.classList.add('view-item');

        searchItem.innerHTML = `
          <span class="m-icon">
            <i class="fa-solid fa-location-dot fa-xl" style="color:  #f4f4f4;">
            </i>
          </span>

          <div>
            <p class="item-title">${name}</p>
            <p class="label-2 item-subtitle">${state || ''}, ${country}</p>
          </div>

          <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link" aria-label="${name} weather" data-search-toggler></a>
        `;

        searchResult.querySelector('[data-search-list]').appendChild(searchItem)

        items.push(searchItem.querySelector('[data-search-toggler]'))

        addEventOnElement(items, 'click', () => {
          toggleSearch()
          searchResult.classList.remove('active')
        })


      });
    }, searchTimeoutDuration)
  }
});

export const updateWeather = function () { };
export const error404 = function () { };