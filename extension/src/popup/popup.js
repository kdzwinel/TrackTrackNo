import { GET_TAB_INFO, SAFELIST_DOMAIN_ADD, SAFELIST_DOMAIN_REMOVE } from '../messages';
import { getActiveTab, domainFromUrl } from '../utils';

const browser = window.browser || window.chrome;

const CONTAINER_WARN_CLASS = 'container--warn';

const $container = document.querySelector('.js-container');
const $safelisted = document.querySelector('.js-safelisted');
const $blocked = document.querySelector('.js-blocked');
let tabId = null;
let domain = null;

function init() {
  browser.runtime
    .sendMessage({ action: GET_TAB_INFO, tabId }, (response) => {
      if (!response) {
        return;
      }

      const blockedLength = Array.isArray(response.blocked) ? response.blocked.length : 0;

      $safelisted.checked = Boolean(response.safelisted);
      $blocked.innerText = blockedLength;

      if (blockedLength) {
        $container.classList.add(CONTAINER_WARN_CLASS);
      }
    });
}

getActiveTab()
  .then((tab) => {
    tabId = tab ? tab.id : null;
    domain = tab ? domainFromUrl(tab.url) : null;
  })
  .then(init);

$safelisted.addEventListener('change', () => {
  if ($safelisted.checked) {
    browser.runtime.sendMessage({ action: SAFELIST_DOMAIN_ADD, domain });
  } else {
    browser.runtime.sendMessage({ action: SAFELIST_DOMAIN_REMOVE, domain });
  }
});
