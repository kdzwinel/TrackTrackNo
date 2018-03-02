// keep track of all requests blocked in each tab
class TabRegistry {
  constructor() {
    this.registry = new Map();
  }

  getTabInfo(tabId) {
    let tabInfo = this.registry.get(tabId);

    if (!tabInfo) {
      tabInfo = {
        tabId,
        url: '',
        blocked: [],
      };
      this.registry.set(tabId, tabInfo);
    }

    return tabInfo;
  }

  tabChangeUrl(tabId, newUrl) {
    const tabInfo = this.getTabInfo(tabId);

    tabInfo.url = newUrl;
    tabInfo.blocked.length = 0;
  }

  tabAddBlocked(tabId, blockedUrl) {
    const tabInfo = this.getTabInfo(tabId);
    tabInfo.blocked.push(blockedUrl);
  }
}

export default TabRegistry;
