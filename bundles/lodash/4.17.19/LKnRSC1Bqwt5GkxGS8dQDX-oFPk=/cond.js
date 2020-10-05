import { default as apply } from "./dist/111.js";
import { default as arrayMap } from "./dist/98.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseRest } from "./dist/49.js";





/** Error message constants. */

var FUNC_ERROR_TEXT = 'Expected a function';
/**
 * Creates a function that iterates over `pairs` and invokes the corresponding
 * function of the first predicate to return truthy. The predicate-function
 * pairs are invoked with the `this` binding and arguments of the created
 * function.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {Array} pairs The predicate-function pairs.
 * @returns {Function} Returns the new composite function.
 * @example
 *
 * var func = _.cond([
 *   [_.matches({ 'a': 1 }),           _.constant('matches A')],
 *   [_.conforms({ 'b': _.isNumber }), _.constant('matches B')],
 *   [_.stubTrue,                      _.constant('no match')]
 * ]);
 *
 * func({ 'a': 1, 'b': 2 });
 * // => 'matches A'
 *
 * func({ 'a': 0, 'b': 1 });
 * // => 'matches B'
 *
 * func({ 'a': '1', 'b': '2' });
 * // => 'no match'
 */

function cond(pairs) {
  var length = pairs == null ? 0 : pairs.length,
      toIteratee = baseIteratee;
  pairs = !length ? [] : arrayMap(pairs, function (pair) {
    if (typeof pair[1] != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }

    return [toIteratee(pair[0]), pair[1]];
  });
  return baseRest(function (args) {
    var index = -1;

    while (++index < length) {
      var pair = pairs[index];

      if (apply(pair[0], this, args)) {
        return apply(pair[1], this, args);
      }
    }
  });
}

const _default = (cond);
export { _default as default };
/*====catalogjs annotation start====
lZSTwq0uL2Rpc3QvMTExLmpzAZPCrC4vZGlzdC85OC5qcwaTwqsuL2Rpc3QvNi5qcwqTwqwuL2Rpc3QvNDkuanMOgadkZWZhdWx0lKFsqF9kZWZhdWx0HcCRkx3AwoelYXBwbHmboWmQwgLAkwMEBcAAwKdkZWZhdWx0kKhhcnJheU1hcJuhaZDCB8CSCAnAAcCnZGVmYXVsdJCsYmFzZUl0ZXJhdGVlm6FpkMILwJIMDcACwKdkZWZhdWx0kKhiYXNlUmVzdJuhaZDCD8CSEBHAA8CnZGVmYXVsdJCvRlVOQ19FUlJPUl9URVhUm6FskMITwJIUFcDAwMCQpGNvbmSboWyVrGJhc2VJdGVyYXRlZahhcnJheU1hcK9GVU5DX0VSUk9SX1RFWFSoYmFzZVJlc3SlYXBwbHnCFsCSFxjAwMDAkKhfZGVmYXVsdJuhbJGkY29uZMIawJIbHMDAwMCQ3AAelgAAAcDCw5YAGAIGwsKWCQADwMLClgsFwMDCwpZxBcAFwsKWKAXAwMLClgEXBwrCwpYJAAjAwsKWCwjAwMLClhsIwBXCwpYBFgsOwsKWCQAMwMLClgsMwMDCwpZODMAJwsKWARcPEsLClgkAEMDCwpYLCMDAwsKWRAjABMLClicBExbCwpYEGBTAwsKWAA/AwMLCllwPwBHCwpbNAzwsFxnCwpYJBMANwsKWBATAwMLClgIBGh3CwpYGARvAwsKWAAjAGMLClgkIwMDCwpYBDhzAwsI=
====catalogjs annotation end====*/