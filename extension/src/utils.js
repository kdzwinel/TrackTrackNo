const browser = window.browser || window.chrome;

export function domainFromUrl(url) {
  try {
    return (new URL(url)).hostname;
  } catch (e) {
    return null;
  }
}

export function getActiveTab() {
  return new Promise((resolve, reject) => {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        reject();
      } else {
        resolve(tabs[0]);
      }
    });
  });
}
