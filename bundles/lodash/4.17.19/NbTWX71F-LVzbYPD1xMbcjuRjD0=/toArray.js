import { default as Symbol } from "./dist/87.js";
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
var symIterator = Symbol ? Symbol.iterator : undefined;
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