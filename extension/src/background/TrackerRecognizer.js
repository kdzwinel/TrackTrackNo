import * as ABPFilterParser from 'abp-filter-parser';
import { domainFromUrl } from './utils';

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

class TrackerRecognizer {
  constructor() {
    this.listData = {};
  }

  readLists(lists) {
    const listsLoading = lists.map(url => fetch(url)
      .then(response => response.text())
      .then(listText => ABPFilterParser.parse(listText, this.listData)));

    return Promise.all(listsLoading);
  }

  isTracker({ url, initiatorUrl, type }) {
    const initiatorDomain = domainFromUrl(initiatorUrl);
    const elementType = requestTypeMap.get(type) || ABPFilterParser.elementTypes.OTHER;

    return ABPFilterParser.matches(this.listData, url, {
      domain: initiatorDomain,
      elementTypeMaskMap: elementType,
    });
  }
}

export default TrackerRecognizer;
