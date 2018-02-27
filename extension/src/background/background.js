import TrackerRecognizer from './TrackerRecognizer';
import TabRegistry from './TabRegistry';
import URLSafelist from './URLSafelist';
import { GET_TAB_INFO } from '../messages';

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
  // request made by something other than a tab (browser, extension)
  if (request.tabId === -1) {
    return { cancel: false };
  }

  if (request.type === MAIN_FRAME) {
    tabRegistry.tabChangeUrl(request.tabId, request.url);

    if (safelist.isSafe(request.url)) {
      safeTabs.add(request.tabId);

      browser.browserAction.setBadgeText({ text: 's', tabId: request.tabId });
      browser.browserAction.setBadgeBackgroundColor({ color: '#0f0', tabId: request.tabId });
    } else {
      safeTabs.delete(request.tabId);

      browser.browserAction.setBadgeText({ text: '', tabId: request.tabId });
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

    browser.browserAction.setBadgeText({ text: 'b', tabId: request.tabId });
    browser.browserAction.setBadgeBackgroundColor({ color: '#f00', tabId: request.tabId });
  }

  return { cancel };
}

browser.webRequest.onBeforeRequest.addListener(
  verify,
  { urls: ['<all_urls>'] },
  ['blocking'],
);

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (sender.id !== browser.runtime.id) {
    return;
  }

  if (message.action === GET_TAB_INFO) {
    browser.tabs.query({ active: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        sendResponse(null);
        return;
      }

      const tabId = tabs[0].id;
      const safelisted = safeTabs.has(tabId);
      const { blocked } = tabRegistry.getTabInfo(tabId);

      sendResponse({
        blocked,
        safelisted,
      });
    });

    // indicate that we will send response async
    return true;
  }

  sendResponse(null);
});
