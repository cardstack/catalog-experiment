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

var castRest = baseRest;










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

export { overArgs as default };
/*====catalogjs annotation start====
lZeVwq0uL2Rpc3QvMTExLmpzAcLAlcKsLi9kaXN0Lzk4LmpzBcLAlcKsLi9kaXN0Lzg1LmpzCsLAlcKrLi9kaXN0LzYuanMOwsCVwqwuL2Rpc3QvNDkuanMTwsCVwq0uL2Rpc3QvMTM1LmpzGMLAlcKsLi9pc0FycmF5LmpzHcLAgadkZWZhdWx0lKFsqG92ZXJBcmdzL8CRky/AwIqlYXBwbHmboWmQwgLAkgMEwADAp2RlZmF1bHSQqGFycmF5TWFwm6FpkMIGwJMHCAnAAcCnZGVmYXVsdJCrYmFzZUZsYXR0ZW6boWmQwgvAkgwNwALAp2RlZmF1bHSQrGJhc2VJdGVyYXRlZZuhaZDCD8CTEBESwAPAp2RlZmF1bHSQqGJhc2VSZXN0m6FpkMIUwJMVFhfABMCnZGVmYXVsdJCpYmFzZVVuYXJ5m6FpkMIZwJMaGxzABcCnZGVmYXVsdJCnaXNBcnJheZuhaZDCHsCSHyDABsCnZGVmYXVsdJCoY2FzdFJlc3SboWyRqGJhc2VSZXN0wiLAkiMkktlXaHR0cHM6Ly9jYXRhbG9nanMuY29tL3BrZ3MvbnBtL2xvZGFzaC80LjE3LjE5L0xLblJTQzFCcXd0NUdreEdTOGRRRFgtb0ZQaz0vX2Nhc3RSZXN0Lmpzp2RlZmF1bHTAwMCQqW5hdGl2ZU1pbpuhbJGkTWF0aMImKZInKMDAwMCQqG92ZXJBcmdzm6FsmahjYXN0UmVzdKdpc0FycmF5qGFycmF5TWFwqWJhc2VVbmFyeaxiYXNlSXRlcmF0ZWWrYmFzZUZsYXR0ZW6oYmFzZVJlc3SpbmF0aXZlTWlupWFwcGx5wisukiwtwMDAwJmlYXBwbHmoYXJyYXlNYXCrYmFzZUZsYXR0ZW6sYmFzZUl0ZXJhdGVlqGJhc2VSZXN0qWJhc2VVbmFyeadpc0FycmF5qGNhc3RSZXN0qW5hdGl2ZU1pbtwAMJYAAAHAwsOWABgCBcLClgkAA8DCwpYLBcDAwsKWzI0FwMDCwpYBFwYKwsKWCQAHwMLClgsIwMDCwpYSCMAbwsKWBQjADcLClgEXCw7CwpYJAAzAwsKWCwvAwMLClgELwBzCwpYBFg8TwsKWCQAQwMLClgsMwMDCwpYBDMAJwsKWAQzAF8LClgEXFBjCwpYJABXAwsKWCwjAwMLClgMIwMDCwpY0CMAowsKWARgZHcLClgkAGsDCwpYLCcDAwsKWEAnAEcLClhEJwBLCwpYBFx4hwsKWCQAfwMLClgsHwMDCwpZIB8AIwsKWzQEDASIlwsKWBAAjwMLClgAIwBbCwpYACMAgwsKWZQEmKsLClgQAJ8DCwpYACcApwsKWOAnABMLClgMIwMDCwpbNAmsBKy/CwpYEACzAwsKWAAjALsLClgkIwMDCwpYDHCTAwsKWAg4twMLC
====catalogjs annotation end====*/