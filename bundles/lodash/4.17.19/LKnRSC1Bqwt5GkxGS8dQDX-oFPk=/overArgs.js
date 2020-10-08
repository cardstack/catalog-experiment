import { default as apply } from "./dist/111.js";
import { default as arrayMap } from "./dist/98.js";
import { default as baseFlatten } from "./dist/85.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseUnary } from "./dist/135.js";
import { default as isArray } from "./isArray.js";


/**
 * A `baseRest` alias which can be replaced with `identity` by module
 * replacement plugins.
 *
 * @private
 * @type {Function}
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */

var castRest0 = baseRest;
const castRest = (castRest0);









/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMin = Math.min;
/**
 * Creates a function that invokes `func` with its arguments transformed.
 *
 * @static
 * @since 4.0.0
 * @memberOf _
 * @category Function
 * @param {Function} func The function to wrap.
 * @param {...(Function|Function[])} [transforms=[_.identity]]
 *  The argument transforms.
 * @returns {Function} Returns the new function.
 * @example
 *
 * function doubled(n) {
 *   return n * 2;
 * }
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * var func = _.overArgs(function(x, y) {
 *   return [x, y];
 * }, [square, doubled]);
 *
 * func(9, 3);
 * // => [81, 6]
 *
 * func(10, 5);
 * // => [100, 10]
 */

var overArgs = castRest(function (func, transforms) {
  transforms = transforms.length == 1 && isArray(transforms[0]) ? arrayMap(transforms[0], baseUnary(baseIteratee)) : arrayMap(baseFlatten(transforms, 1), baseUnary(baseIteratee));
  var funcsLength = transforms.length;
  return baseRest(function (args) {
    var index = -1,
        length = nativeMin(args.length, funcsLength);

    while (++index < length) {
      args[index] = transforms[index].call(this, args[index]);
    }

    return apply(func, this, args);
  });
});
const _default = (overArgs);
export { _default as default };
/*====catalogjs annotation start====
lZeTwq0uL2Rpc3QvMTExLmpzAZPCrC4vZGlzdC85OC5qcwWTwqwuL2Rpc3QvODUuanMKk8KrLi9kaXN0LzYuanMOk8KsLi9kaXN0LzQ5LmpzE5PCrS4vZGlzdC8xMzUuanMYk8KsLi9pc0FycmF5LmpzHYGnZGVmYXVsdJShbKhfZGVmYXVsdDfAkZM3wMKMpWFwcGx5m6FpkMICwJIDBMAAwKdkZWZhdWx0kKhhcnJheU1hcJuhaZDCBsCTBwgJwAHAp2RlZmF1bHSQq2Jhc2VGbGF0dGVum6FpkMILwJIMDcACwKdkZWZhdWx0kKxiYXNlSXRlcmF0ZWWboWmQwg/AkxAREsADwKdkZWZhdWx0kKhiYXNlUmVzdJuhaZDCFMCTFRYXwATAp2RlZmF1bHSQqWJhc2VVbmFyeZuhaZDCGcCTGhscwAXAp2RlZmF1bHSQp2lzQXJyYXmboWmQwh7Akh8gwAbAp2RlZmF1bHSQqWNhc3RSZXN0MJuhbJGoYmFzZVJlc3TCIsCSIyTAwMDAkKhjYXN0UmVzdJuhbJGpY2FzdFJlc3QwwibAkicoktlXaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2Nhc3RSZXN0Lmpzp2RlZmF1bHTAwMCQqW5hdGl2ZU1pbpuhbJGkTWF0aMIqLZIrLMDAwMCQqG92ZXJBcmdzm6FsmahjYXN0UmVzdKdpc0FycmF5qGFycmF5TWFwqWJhc2VVbmFyeaxiYXNlSXRlcmF0ZWWrYmFzZUZsYXR0ZW6oYmFzZVJlc3SpbmF0aXZlTWlupWFwcGx5wi8ykjAxwMDAwJmlYXBwbHmoYXJyYXlNYXCrYmFzZUZsYXR0ZW6sYmFzZUl0ZXJhdGVlqGJhc2VSZXN0qWJhc2VVbmFyeadpc0FycmF5qGNhc3RSZXN0qW5hdGl2ZU1pbqhfZGVmYXVsdJuhbJGob3ZlckFyZ3PCNMCSNTbAwMDAkNwAOJYAAAHAwsOWABgCBcLClgkAA8DCwpYLBcDAwsKWzI0FwMDCwpYBFwYKwsKWCQAHwMLClgsIwMDCwpYSCMAbwsKWBQjADcLClgEXCw7CwpYJAAzAwsKWCwvAwMLClgELwBzCwpYBFg8TwsKWCQAQwMLClgsMwMDCwpYBDMAJwsKWAQzAF8LClgEXFBjCwpYJABXAwsKWCwjAwMLClgMIwMDCwpY0CMAswsKWARgZHcLClgkAGsDCwpYLCcDAwsKWEAnAEcLClhEJwBLCwpYBFx4hwsKWCQAfwMLClgsHwMDCwpZIB8AIwsKWzQEDASIlwsKWBAAjwMLClgAJwBbCwpYECcDAwsKWAQEmKcLClgYBJ8DCwpYACMAkwsKWAAjAIMLClmQBKi7CwpYEACvAwsKWAAnALcLCljgJwATCwpYDCMDAwsKWzQJrAS8zwsKWBAAwwMLClgAIwDLCwpYECMDAwsKWAxwowMLClgEBNDfCwpYGATXAwsKWAAjAMcLClgkIwMDCwpYBDjbAwsI=
====catalogjs annotation end====*/