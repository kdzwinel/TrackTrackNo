/* eslint-env jest */

import TrackerRecognizer from './TrackerRecognizer';

describe('TrackerRecognizer', () => {
  it('doesn\'t block anything if blocklist was not specified', () => {
    const tr = new TrackerRecognizer();
    const isTracker = tr.isTracker({
      url: 'https://www.google-analytics.com/analytics.js',
      initiatorUrl: 'https://example.com/some/article.html',
      type: 'script',
    });

    expect(isTracker).toBe(false);
  });

  it('parses and allows testing resources against a list with adp-syntax', () => {
    const tr = new TrackerRecognizer();

    tr.addBlocklist(`
||google-analytics.com/analytics.js
||gemius.pl^$third-party
    `);

    expect(tr.isTracker({
      url: 'https://www.google-analytics.com/analytics.js',
      initiatorUrl: 'https://example.com/some/article.html',
      type: 'script',
    })).toBe(true);

    expect(tr.isTracker({
      url: 'https://gemius.pl/track/?u=34',
      initiatorUrl: 'https://example.com/some/article.html',
      type: 'script',
    })).toBe(true);
  });

  it('doesn\'t throw if list has invalid syntax', () => {
    const tr = new TrackerRecognizer();

    expect(() => {
      tr.addBlocklist(`
% some list
# testing
(;!@#$%^&*())
||||||google-analytics.com/analytics.js
||gemius.....pl^$^$^$third-party
||gemius.pl^$unsupported-option
    `);
    }).not.toThrow();
  });
});
