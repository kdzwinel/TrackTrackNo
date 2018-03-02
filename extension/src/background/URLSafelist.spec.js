/* eslint-env jest */

import URLSafelist from './URLSafelist';

describe('URLSafelist', () => {
  it('is empty by default', () => {
    const safelist = new URLSafelist();
    expect(safelist.toArray().length).toBe(0);
  });

  it('allows matching URLs agains list of safelisted domains', () => {
    const safelist = new URLSafelist();

    safelist.addDomain('safe.com');
    safelist.addDomain('example.com');

    expect(safelist.isSafe('https://example.com/some/article.html?tst=test')).toBe(true);
    expect(safelist.isSafe('https://pro.example.com/')).toBe(false);
    expect(safelist.isSafe('https://evil.com/')).toBe(false);
  });

  it('doesn\'t report domain as safe once it was removed', () => {
    const safelist = new URLSafelist();

    safelist.addDomain('safe.com');
    safelist.addDomain('example.com');
    safelist.removeDomain('safe.com');

    expect(safelist.isSafe('https://safe.com/article')).toBe(false);
  });

  it('serialized list doesn\'t contain duplicates', () => {
    const safelist = new URLSafelist();

    safelist.addDomain('safe.com');
    safelist.removeDomain('safe.com');
    safelist.addDomain('example.com');
    safelist.addDomain('example.com');

    expect(safelist.toArray().length).toBe(1);
  });
});
