import TrackerRecognizer from './TrackerRecognizer';
import TabRegistry from './TabRegistry';
import URLSafelist from './URLSafelist';
import { loadSafelist, saveSafelist } from './safelistStorage';
import loadBlocklists from './blocklistStorage';
import { GET_TAB_INFO, SAFELIST_DOMAIN_ADD, SAFELIST_DOMAIN_REMOVE } from '../messages';

const browser = window.browser || window.chrome;
const MAIN_FRAME = 'main_frame';

const tabRegistry = new TabRegistry();
const safelist = new URLSafelist();
const recognizer = new TrackerRecognizer();
const safeTabs = new Set();

loadBlocklists()
  .then(lists => lists.forEach(list => recognizer.addBlocklist(list)));

loadSafelist()
  .then(domains => domains.forEach(domain => safelist.addDomain(domain)));

function verifyRequest(request) {
  // request made by something other than a tab (browser, extension)
  if (request.tabId === -1) {
    return { cancel: false };
  }

  // top level navigation
  if (request.type === MAIN_FRAME) {
    tabRegistry.tabChangeUrl(request.tabId, request.url);

    if (safelist.isSafe(request.url)) {
      safeTabs.add(request.tabId);
    } else {
      safeTabs.delete(request.tabId);
    }

    browser.browserAction.setIcon({
      path: 'assets/icons/icon-48.png',
      tabId: request.tabId,
    });

    return { cancel: false };
  }

  // do not cancel any of the requests if page is safelisted
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

    browser.browserAction.setIcon({
      path: 'assets/icons/icon-48-alt.png',
      tabId: request.tabId,
    });

    // save info about blocked requests
    tabRegistry.tabAddBlocked(request.tabId, request.url);
  }

  return { cancel };
}

function respondToMessage(message, sender, sendResponse) {
  // only respond to messages comming from this extension
  if (sender.id !== browser.runtime.id) {
    return;
  }

  if (message.action === GET_TAB_INFO) {
    const tabInfo = tabRegistry.getTabInfo(message.tabId);

    sendResponse({
      blocked: tabInfo.blocked,
      safelisted: safeTabs.has(message.tabId),
    });
    return;
  } else if (message.action === SAFELIST_DOMAIN_ADD) {
    safelist.addDomain(message.domain);
    browser.tabs.reload(message.tabId);
    saveSafelist(safelist.toArray());
  } else if (message.action === SAFELIST_DOMAIN_REMOVE) {
    safelist.removeDomain(message.domain);
    browser.tabs.reload(message.tabId);
    saveSafelist(safelist.toArray());
  }

  sendResponse(null);
}

browser.webRequest.onBeforeRequest.addListener(
  verifyRequest,
  { urls: ['<all_urls>'] },
  ['blocking'],
);

browser.runtime.onMessage.addListener(respondToMessage);
