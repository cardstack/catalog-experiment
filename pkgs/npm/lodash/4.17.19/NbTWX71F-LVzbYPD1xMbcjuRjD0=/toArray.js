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