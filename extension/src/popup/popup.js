import { GET_TAB_INFO, SAFELIST_DOMAIN_ADD, SAFELIST_DOMAIN_REMOVE } from '../messages';
import { getActiveTab, domainFromUrl } from '../utils';

const browser = window.browser || window.chrome;

const CONTAINER_WARN_CLASS = 'container--warn';
const LIST_EMPTY_CLASS = 'requests-list--empty';
const LIST_ITEM_CLASS = 'requests-list__request';

const $container = document.querySelector('.js-container');
const $list = document.querySelector('.js-requests-list');
const $safelisted = document.querySelector('.js-safelisted');
const $blocked = document.querySelector('.js-blocked');
let tabId = null;
let domain = null;

function showList(urls) {
  $list.classList.remove(LIST_EMPTY_CLASS);

  const df = document.createDocumentFragment();
  urls.forEach((url) => {
    const div = document.createElement('div');
    div.innerText = url;
    div.title = url;
    div.classList.add(LIST_ITEM_CLASS);
    df.appendChild(div);
  });

  $list.appendChild(df);
}

function init(data) {
  if (!data) {
    return;
  }

  const blockedLength = Array.isArray(data.blocked) ? data.blocked.length : 0;

  $safelisted.checked = Boolean(data.safelisted);
  $blocked.innerText = blockedLength;

  if (blockedLength) {
    $container.classList.add(CONTAINER_WARN_CLASS);
    showList(data.blocked);
  }
}

getActiveTab()
  .then((tab) => {
    tabId = tab ? tab.id : null;
    domain = tab ? domainFromUrl(tab.url) : null;
    browser.runtime.sendMessage({ action: GET_TAB_INFO, tabId }, init);
  });

// handle adding/removing from safelist
$safelisted.addEventListener('change', () => {
  if ($safelisted.checked) {
    browser.runtime.sendMessage({ action: SAFELIST_DOMAIN_ADD, domain });
  } else {
    browser.runtime.sendMessage({ action: SAFELIST_DOMAIN_REMOVE, domain });
  }
  window.close();
});

// apply translations
Array.from(document.querySelectorAll('[data-trans-key]')).forEach((item) => {
  item.innerText = browser.i18n.getMessage(item.dataset.transKey);
});
