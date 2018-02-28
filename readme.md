# TrackTrackNo
[![Build Status](https://travis-ci.org/kdzwinel/TrackTrackNo.svg?branch=master)](https://travis-ci.org/kdzwinel/TrackTrackNo)

Web Extension that makes the trackers go away.

## Features
- [x] block known trackers
  - [ ] periodically pull tracker list
- [x] allow to create a safelist of domains
  - [x] preserve safelist
- [x] show popup with information about the page
  - [x] list all blocked resources

## How to install it
1. Download or clone this repository
1. `yarn && yarn run build`
1. Load `./dist` folder as an "unpaced extension" (tested in Chrome and Firefox)

## About
Icon - [Freepik](http://www.freepik.com) - [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)
Tracker list - [EasyList](https://easylist.to/) - [GPLv3](https://easylist.to/pages/licence.html)
