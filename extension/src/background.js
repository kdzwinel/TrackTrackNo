import TrackerRecognizer from './TrackerRecognizer';
import TabRegistry from './TabRegistry';
import { domainFromUrl } from './utils';

const browser = window.browser || window.chrome;
const tabRegistry = new TabRegistry();
const recognizer = new TrackerRecognizer();

// TODO make dynamic
const domainSafelist = new Set([
  'stackoverflow.com',
  'github.com',
]);
const tabSafelist = new Set();

const MAIN_FRAME = 'main_frame';
const lists = [
  'assets/easylist.txt',
  'assets/easyprivacy.txt',
].map(path => browser.extension.getURL(path));

console.time('Loading lists.');
recognizer
  .readLists(lists)
  .then(() => console.timeEnd('Loading lists.'));

function verify(request) {
  if (request.type === MAIN_FRAME) {
    tabRegistry.tabChangeUrl(request.tabId, request.url);

    const domain = domainFromUrl(request.url);
    if (domain && domainSafelist.has(domain)) {
      tabSafelist.add(request.tabId);
      console.log(`Tab ${request.tabId} added to the safelist`);
    } else {
      tabSafelist.delete(request.tabId);
      console.log(`Tab ${request.tabId} removed from the safelist`);
    }
    // TODO should we skip check for main frames?
  } else if (tabSafelist.has(request.tabId)) {
    console.log(`Tab ${request.tabId} on a safelist`);
    return { cancel: false };
  }

  const initiatorUrl = request.initiator || request.url;

  const cancel = recognizer.isTracker({
    url: request.url,
    type: request.type,
    initiatorUrl,
  });

  if (cancel) {
    console.log(`blocking ${request.url}`);
    tabRegistry.tabAddBlocked(request.tabId, request.url);

    console.log(tabRegistry.getTabInfo(request.tabId));
  }

  return { cancel };
}

browser.webRequest.onBeforeRequest.addListener(
  verify,
  { urls: ['<all_urls>'] },
  ['blocking'],
);
