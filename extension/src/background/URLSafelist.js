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

  isSafe(url) {
    const domain = domainFromUrl(url);

    if (domain && this.domainSafelist.has(domain)) {
      return true;
    }

    return false;
  }
}

export default URLSafelist;
