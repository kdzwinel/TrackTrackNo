import { GET_TAB_INFO } from '../messages';

const browser = window.browser || window.chrome;
const $safelisted = document.querySelector('.js-safelisted');
const $blocked = document.querySelector('.js-blocked');

browser.runtime
  .sendMessage({ action: GET_TAB_INFO }, (response) => {
    console.log(response);

    $safelisted.innerText = Boolean(response.safelisted);
    $blocked.innerText = Array.isArray(response.blocked) ? response.blocked.length : 0;
  });
