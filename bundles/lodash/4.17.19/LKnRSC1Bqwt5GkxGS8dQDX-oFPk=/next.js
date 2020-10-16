import { default as toArray } from "./toArray.js";


/**
 * Gets the next value on a wrapped object following the
 * [iterator protocol](https://mdn.io/iteration_protocols#iterator).
 *
 * @name next
 * @memberOf _
 * @since 4.0.0
 * @category Seq
 * @returns {Object} Returns the next iterator value.
 * @example
 *
 * var wrapped = _([1, 2]);
 *
 * wrapped.next();
 * // => { 'done': false, 'value': 1 }
 *
 * wrapped.next();
 * // => { 'done': false, 'value': 2 }
 *
 * wrapped.next();
 * // => { 'done': true, 'value': undefined }
 */

function wrapperNext() {
  if (this.__values__ === undefined) {
    this.__values__ = toArray(this.value());
  }

  var done = this.__index__ >= this.__values__.length,
      value = done ? undefined : this.__values__[this.__index__++];
  return {
    'done': done,
    'value': value
  };
}


export { wrapperNext as default };
/*====catalogjs annotation start====
lZGVwqwuL3RvQXJyYXkuanMBwsCBp2RlZmF1bHSUoWyrd3JhcHBlck5leHQIwJGTCMDAgqd0b0FycmF5m6FpkMICwJIDBMAAwKdkZWZhdWx0kKt3cmFwcGVyTmV4dJuhbJGndG9BcnJhecIFwJIGB8DAwMCQmZYAAAHAwsOWABcCBcLClgkAA8DCwpYLB8DAwsKWQgfAwMLCls0B6szGBgjCwpYJC8AEwsKWCQvAwMLClgMOB8DCwg==
====catalogjs annotation end====*/