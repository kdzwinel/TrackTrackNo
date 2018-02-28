const browser = window.browser || window.chrome;

const BLOCKLISTS_STORE_KEY = 'blocklists';
const buildInBlocklists = [
  'assets/easyprivacy.txt',
  'assets/easylist.txt',
];

function getBuildInBlocklists() {
  return Promise.all(buildInBlocklists.map((path) => {
    const url = browser.extension.getURL(path);

    return fetch(url).then(response => response.text());
  }));
}

export default function loadBlocklists() {
  return new Promise((resolve, reject) => {
    browser.storage.local.get(BLOCKLISTS_STORE_KEY, (response) => {
      if (Array.isArray(response[BLOCKLISTS_STORE_KEY])) {
        resolve(response[BLOCKLISTS_STORE_KEY]);
      } else {
        getBuildInBlocklists()
          .then((lists) => {
            browser.storage.local.set({ [BLOCKLISTS_STORE_KEY]: lists });
            resolve(lists);
          });
      }
    });
  });
}
