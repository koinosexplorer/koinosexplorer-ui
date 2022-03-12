import dot from 'dot-object';
import { forIn as _forIn } from 'lodash';

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