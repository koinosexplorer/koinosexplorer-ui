import dot from 'dot-object';
import { forIn as _forIn, get as _get } from 'lodash';
import * as base64 from "byte-base64";

export const dotData = (data) => {
  var row = {};
  for (let index = 0; index < data.length; index++) {
    const d = data[index];
    row[d.name] = d.value;
  }
  dot.object(row)
  return row;
}

export const isBase64 = (str) => {
  try {
    window.atob(str);
    return true
  } catch(e) {
    return false
  }
}

export const getNonce = (_nonce) => {
  let nonce = base64.base64ToBytes(_nonce)
  return _get(nonce, "[1]", _nonce);
}