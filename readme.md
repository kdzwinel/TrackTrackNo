# TrackTrackNo
[![Build Status](https://travis-ci.org/kdzwinel/TrackTrackNo.svg?branch=master)](https://travis-ci.org/kdzwinel/TrackTrackNo)

Web Extension that makes the trackers go away.

<img src='https://i.imgur.com/sXQltZF.png' alt='TrackTrackNo extension in action' width="600">

## Features
- [x] block known trackers
  - [x] periodically pull latest tracker list
- [x] allow to create a safelist of domains
  - [x] store safelist locally
- [x] show popup with information about the page
  - [x] list all blocked resources
- [x] multilanguage support (ATM: EN and PL)

## How to install it
1. Download or clone this repository
1. `yarn && yarn run build`
1. Load `./dist` folder as an "unpaced extension" (Chrome) or "temporary add-on" (Firefox)

## Technical info
Chrome and Firefox extension built in vanilla JavaScript. Trackers are recognized based on the [EasyPrivacy](https://easylist.to/tag/easyprivacy.html) list. Extension supports multiple ADP formatted lists (see `blocklistStorage.js`). Lists are parsed, and requsts are matched by a fork of [abp-filter-parser](https://github.com/bbondy/abp-filter-parser) (original one is unmaintained and doesn't support newer ADP list syntax). Extension stores both safelist of domains and filter lists in the local storage (`browser.storage.local`).

Code is organized into two main folders: `background` - containing code of the background page, and `popup` - containing code of the browser action popup. Background page communicates with the popup using `browser.runtime.sendMessage`.

### Bucketlist
- [ ] Investigate using [ad-block](https://github.com/brave/ad-block) instead of abp-filter-parser
- [ ] Investigate recognizing trackers from outside of the blocklist (just like Privacy Badger does)
- [ ] Download lists from a safe URL that guarantees anonymity
- [ ] Retry if updating list fails
- [ ] Use newely downloaded lists right away (don't wait for browser/extension reload)
- [ ] Don't fetch lists more often than specified in the list header (`! Expires: 4 days (update frequency)`)

## About

- Tracker list - [EasyList](https://easylist.to/) - [GPLv3](https://easylist.to/pages/licence.html)
- Icon - [Freepik](http://www.freepik.com) - [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)
