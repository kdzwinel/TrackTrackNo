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

const listUrl = browser.extension.getURL('assets/easyprivacy.txt');
const listData = {};

fetch(listUrl)
  .then(response => response.text())
  .then(listText => ABPFilterParser.parse(listText, listData));

function verify(requestDetails) {
  const initiatorUrl = new URL(requestDetails.initiator);
  const elementType = requestTypeMap.get(requestDetails.type) || ABPFilterParser.elementTypes.OTHER;

  const cancel = ABPFilterParser.matches(listData, requestDetails.url, {
    domain: initiatorUrl.domain,
    elementTypeMaskMap: elementType,
  });

  return { cancel };
}

browser.webRequest.onBeforeRequest.addListener(
  verify,
  { urls: ['<all_urls>'] },
  ['blocking'],
);
