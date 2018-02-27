import TrackerRecognizer from './TrackerRecognizer';
import TabRegistry from './TabRegistry';

const browser = window.browser || window.chrome;
const tabRegistry = new TabRegistry();
const recognizer = new TrackerRecognizer();

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
  const initiatorUrl = request.initiator || request.url;

  if (request.type === MAIN_FRAME) {
    tabRegistry.tabChangeUrl(request.tabId, request.url);
  }

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
