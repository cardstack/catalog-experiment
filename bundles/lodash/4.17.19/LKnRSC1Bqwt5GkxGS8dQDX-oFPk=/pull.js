import { default as baseRest } from "./dist/49.js";
import { default as pullAll } from "./pullAll.js";



/**
 * Removes all given values from `array` using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * **Note:** Unlike `_.without`, this method mutates `array`. Use `_.remove`
 * to remove elements from an array by predicate.
 *
 * @static
 * @memberOf _
 * @since 2.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @param {...*} [values] The values to remove.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = ['a', 'b', 'c', 'a', 'b', 'c'];
 *
 * _.pull(array, 'a', 'c');
 * console.log(array);
 * // => ['b', 'b']
 */

var pull = baseRest(pullAll);

export { pull as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvNDkuanMBwsCVwqwuL3B1bGxBbGwuanMFwsCBp2RlZmF1bHSUoWykcHVsbA7AkZMOwMCDqGJhc2VSZXN0m6FpkMICwJIDBMAAwKdkZWZhdWx0kKdwdWxsQWxsm6FpkMIGwJIHCMABwKdkZWZhdWx0kKRwdWxsm6FskqhiYXNlUmVzdKdwdWxsQWxswgoNkgsMwMDAwJKoYmFzZVJlc3SncHVsbEFsbJ+WAAABwMLDlgAXAgXCwpYJAAPAwsKWCwjAwMLClgAIwAjCwpYBFwYJwsKWCQAHwMLClgsHwMDCwpYBB8DAwsKWzQJ5AQoOwsKWBAALwMLClgAEwA3CwpYJBMDAwsKWAwEEwMLClgIODMDCwg==
====catalogjs annotation end====*/