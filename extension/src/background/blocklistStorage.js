const browser = window.browser || window.chrome;

const BLOCKLISTS_STORE_KEY = 'blocklists';
const UPDATE_FREQUENCY = 1000 * 60 * 60 * 24;
const BLOCKLISTS = [
  {
    name: 'easyprivacy',
    local: 'assets/easyprivacy.txt',
    // TODO replace with an anonymous proxy / safe URL
    external: 'https://easylist.to/easylist/easyprivacy.txt',
  },
];

function getBuildInBlocklists() {
  // read embedded blocklist from disk
  return Promise.all(BLOCKLISTS
    .filter(list => list.local)
    .map((list) => {
      const url = browser.extension.getURL(list.local);

      return fetch(url)
        .then(response => response.text())
        .then(text => ({
          name: list.name,
          expires: Date.now(),
          text,
        }));
    }));
}

function updateList(name) {
  const blocklist = BLOCKLISTS.find(list => list.name === name);

  if (!blocklist) {
    return;
  }

  fetch(blocklist.external)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Downloading ${blocklist.url} failed.`);
      }
      return response.text();
    })
    .then((text) => {
      browser.storage.local.get(BLOCKLISTS_STORE_KEY, (response) => {
        const allLists = response[BLOCKLISTS_STORE_KEY] || [];
        const listToUpdate = allLists.find(list => list.name === name);

        if (!listToUpdate) {
          return;
        }

        // TODO validate before saving (run parser over it, check if it's not empty)
        listToUpdate.text = text;
        // TODO get actual expiration date from the list header
        listToUpdate.expires = Date.now() + (1000 * 60 * 60 * 24 * 4);

        // TODO notify TrackerRecognizer that the list was updated and start using it right away
        browser.storage.local.set({ [BLOCKLISTS_STORE_KEY]: allLists });
      });
    })
    .catch((e) => {
      // TODO retry on error
      console.error(e);
    });
}

function checkForUpdates() {
  // check if any of the blocklists expired and needs to be updated
  browser.storage.local.get(BLOCKLISTS_STORE_KEY, (response) => {
    if (!Array.isArray(response[BLOCKLISTS_STORE_KEY])) {
      return;
    }

    response[BLOCKLISTS_STORE_KEY].forEach((list) => {
      if (list.expires < Date.now()) {
        updateList(list.name);
      }
    });
  });

  setTimeout(checkForUpdates, UPDATE_FREQUENCY);
}

export default function loadBlocklists() {
  checkForUpdates();

  return new Promise((resolve) => {
    browser.storage.local.get(BLOCKLISTS_STORE_KEY, (response) => {
      if (Array.isArray(response[BLOCKLISTS_STORE_KEY])) {
        resolve(response[BLOCKLISTS_STORE_KEY].map(list => list.text));
      } else {
        getBuildInBlocklists()
          .then((lists) => {
            browser.storage.local.set({ [BLOCKLISTS_STORE_KEY]: lists });
            resolve(lists.map(list => list.text));
          });
      }
    });
  });
}
