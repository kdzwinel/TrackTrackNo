/* eslint-env jest */

import TabRegistry from './TabRegistry';

describe('TabRegistry', () => {
  it('returns empty tab info for unknown tabs', () => {
    const tr = new TabRegistry();
    const tabInfo = tr.getTabInfo(1);

    expect(tabInfo.tabId).toBe(1);
    expect(tabInfo.url).toBe('');
    expect(tabInfo.blocked.length).toBe(0);
  });

  it('returns list of blocked requests and a page URL', () => {
    const tr = new TabRegistry();
    const url = 'https://example.com';

    tr.tabChangeUrl(1, url);
    tr.tabAddBlocked(1, 'https://tracker.com/image.png');
    tr.tabAddBlocked(1, 'https://tracker.com/some/script.js');

    const tabInfo = tr.getTabInfo(1);

    expect(tabInfo.tabId).toBe(1);
    expect(tabInfo.url).toBe(url);
    expect(tabInfo.blocked.length).toBe(2);
  });

  it('resets list of blocked URLs when main URL changes', () => {
    const tr = new TabRegistry();
    const url = 'https://example.com';
    const url2 = 'https://safe.com';

    tr.tabChangeUrl(1, url);
    tr.tabAddBlocked(1, 'https://tracker.com/image.png');
    tr.tabAddBlocked(1, 'https://tracker.com/some/script.js');
    tr.tabChangeUrl(1, url2);

    const tabInfo = tr.getTabInfo(1);

    expect(tabInfo.tabId).toBe(1);
    expect(tabInfo.url).toBe(url2);
    expect(tabInfo.blocked.length).toBe(0);
  });
});
