import TrackerRecognizer from './TrackerRecognizer';

const browser = window.browser || window.chrome;
const recognizer = new TrackerRecognizer();

const lists = [
  'assets/easylist.txt',
  'assets/easyprivacy.txt',
].map(path => browser.extension.getURL(path));

console.time('Loading lists.');
recognizer
  .readLists(lists)
  .then(() => console.timeEnd('Loading lists.'));

function verify(requestDetails) {
  const initiatorUrl = requestDetails.initiator || requestDetails.url;

  const cancel = recognizer.isTracker({
    url: requestDetails.url,
    type: requestDetails.type,
    initiatorUrl,
  });

  if (cancel) {
    console.log(`blocking ${requestDetails.url}`);
  }

  return { cancel };
}

browser.webRequest.onBeforeRequest.addListener(
  verify,
  { urls: ['<all_urls>'] },
  ['blocking'],
);
