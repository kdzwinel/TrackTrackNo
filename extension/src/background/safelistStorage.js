const browser = window.browser || window.chrome;

const SAFELIST_STORE_KEY = 'safelist';

export function loadSafelist() {
  return new Promise((resolve) => {
    browser.storage.local.get(SAFELIST_STORE_KEY, (response) => {
      resolve(Array.isArray(response[SAFELIST_STORE_KEY]) ? response[SAFELIST_STORE_KEY] : []);
    });
  });
}

export function saveSafelist(safelist) {
  browser.storage.local.set({ [SAFELIST_STORE_KEY]: safelist });
}
