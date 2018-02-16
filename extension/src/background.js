/* eslint-env webextensions, browser */

const browser = window.browser || window.chrome;

const pattern = '<all_urls>';

function cancel(requestDetails) {
  console.log('Canceling: ', requestDetails.url);
  return { cancel: true };
}

browser.webRequest.onBeforeRequest.addListener(
  cancel,
  { urls: [pattern], types: ['image'] },
  ['blocking'],
);
