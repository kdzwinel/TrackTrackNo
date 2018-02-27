import TrackerRecognizer from './TrackerRecognizer';
import TabRegistry from './TabRegistry';
import URLSafelist from './URLSafelist';

const browser = window.browser || window.chrome;
const MAIN_FRAME = 'main_frame';

const tabRegistry = new TabRegistry();
const safelist = new URLSafelist();
const recognizer = new TrackerRecognizer();
const safeTabs = new Set();

const lists = [
  'assets/easylist.txt',
  'assets/easyprivacy.txt',
].map(path => browser.extension.getURL(path));

recognizer.readLists(lists);
safelist.addDomains(['github.com', 'stackoverflow.com']);

function verify(request) {
  if (request.type === MAIN_FRAME) {
    tabRegistry.tabChangeUrl(request.tabId, request.url);

    if (safelist.isSafe(request.url)) {
      safeTabs.add(request.tabId);
    } else {
      safeTabs.delete(request.tabId);
    }

    return { cancel: false };
  }

  if (safeTabs.has(request.tabId)) {
    return { cancel: false };
  }

  const cancel = recognizer.isTracker({
    url: request.url,
    type: request.type,
    initiatorUrl: request.initiator || request.url,
  });

  if (cancel) {
    console.log(`blocking ${request.url}`);
    tabRegistry.tabAddBlocked(request.tabId, request.url);
  }

  return { cancel };
}

browser.webRequest.onBeforeRequest.addListener(
  verify,
  { urls: ['<all_urls>'] },
  ['blocking'],
);
