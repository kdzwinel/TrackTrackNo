import { domainFromUrl } from '../utils';

class URLSafelist {
  constructor() {
    this.domainSafelist = new Set();
  }

  addDomain(domain) {
    this.domainSafelist.add(domain);
  }

  removeDomain(domain) {
    this.domainSafelist.delete(domain);
  }

  toArray() {
    return Array.from(this.domainSafelist);
  }

  isSafe(url) {
    const domain = domainFromUrl(url);

    return domain && this.domainSafelist.has(domain);
  }
}

export default URLSafelist;
