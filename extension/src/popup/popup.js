import {GET_TAB_INFO} from '../messages';

const browser = window.browser || window.chrome;

window.onload = () => {
  browser.runtime
    .sendMessage({ action: GET_TAB_INFO }, (response) => {
      console.log(response);
    });
};
