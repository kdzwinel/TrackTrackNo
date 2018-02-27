import { domainFromUrl } from './utils';

class URLSafelist {
  constructor() {
    this.domainSafelist = new Set();
  }

  addDomains(domains) {
    domains.forEach(d => this.domainSafelist.add(d));
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
