/* eslint-env webextensions, browser */

import * as ABPFilterParser from 'abp-filter-parser';

const browser = window.browser || window.chrome;

const requestTypeMap = new Map([
  ['script', ABPFilterParser.elementTypes.SCRIPT],
  ['image', ABPFilterParser.elementTypes.IMAGE],
  ['stylesheet', ABPFilterParser.elementTypes.STYLESHEET],
  ['document', ABPFilterParser.elementTypes.DOCUMENT],
  ['xmlhttprequest', ABPFilterParser.elementTypes.XMLHTTPREQUEST],
  ['main_frame', ABPFilterParser.elementTypes.DOCUMENT],
  ['sub_frame', ABPFilterParser.elementTypes.SUBDOCUMENT],
  ['object_subrequest', ABPFilterParser.elementTypes.OBJECTSUBREQUEST],
]);

const lists = [
  'assets/easylist.txt',
  'assets/easyprivacy.txt',
];

const listData = {};

lists.map((listPath) => {
  const listURL = browser.extension.getURL(listPath);

  return fetch(listURL)
    .then(response => response.text())
    .then(listText => ABPFilterParser.parse(listText, listData));
});

function verify(requestDetails) {
  const initiator = requestDetails.initiator || requestDetails.url;
  let initiatorDomain = null;

  try {
    initiatorDomain = (new URL(initiator)).hostname;
  } catch (e) {
    // we fall back to null
  }

  const elementType = requestTypeMap.get(requestDetails.type) || ABPFilterParser.elementTypes.OTHER;

  const cancel = ABPFilterParser.matches(listData, requestDetails.url, {
    domain: initiatorDomain,
    elementTypeMaskMap: elementType,
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
