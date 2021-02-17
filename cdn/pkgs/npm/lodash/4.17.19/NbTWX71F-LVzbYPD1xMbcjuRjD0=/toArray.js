import { default as Symbol0 } from "./dist/87.js";
import { default as copyArray } from "./dist/117.js";
import { default as getTag } from "./dist/45.js";
import { default as isArrayLike } from "./isArrayLike.js";
import { default as isString } from "./isString.js";
import { default as mapToArray } from "./dist/153.js";
import { default as setToArray } from "./dist/154.js";
import { default as stringToArray } from "./dist/143.js";
import { default as values } from "./values.js";
function iteratorToArray(iterator) {
  var data,
      result = [];

  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }

  return result;
}
var mapTag = '[object Map]',
    setTag = '[object Set]';
var symIterator = Symbol0 ? Symbol0.iterator : undefined;
function toArray(value) {
  if (!value) {
    return [];
  }

  if (isArrayLike(value)) {
    return isString(value) ? stringToArray(value) : copyArray(value);
  }

  if (symIterator && value[symIterator]) {
    return iteratorToArray(value[symIterator]());
  }

  var tag = getTag(value),
      func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
  return func(value);
}
export { toArray as default };
/*====catalogjs annotation start====
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
====catalogjs annotation end====*/