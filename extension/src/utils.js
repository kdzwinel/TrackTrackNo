export function domainFromUrl(url) {
  try {
    return (new URL(url)).hostname;
  } catch (e) {
    return null;
  }
}
