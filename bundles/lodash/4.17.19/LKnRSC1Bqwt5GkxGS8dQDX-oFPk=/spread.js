import { default as apply } from "./dist/111.js";
import { default as arrayPush } from "./dist/139.js";
import { default as baseRest } from "./dist/49.js";
import { default as castSlice } from "./dist/140.js";
import { default as toInteger } from "./toInteger.js";






/** Error message constants. */

var FUNC_ERROR_TEXT = 'Expected a function';
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMax = Math.max;
/**
 * Creates a function that invokes `func` with the `this` binding of the
 * create function and an array of arguments much like
 * [`Function#apply`](http://www.ecma-international.org/ecma-262/7.0/#sec-function.prototype.apply).
 *
 * **Note:** This method is based on the
 * [spread operator](https://mdn.io/spread_operator).
 *
 * @static
 * @memberOf _
 * @since 3.2.0
 * @category Function
 * @param {Function} func The function to spread arguments over.
 * @param {number} [start=0] The start position of the spread.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.spread(function(who, what) {
 *   return who + ' says ' + what;
 * });
 *
 * say(['fred', 'hello']);
 * // => 'fred says hello'
 *
 * var numbers = Promise.all([
 *   Promise.resolve(40),
 *   Promise.resolve(36)
 * ]);
 *
 * numbers.then(_.spread(function(x, y) {
 *   return x + y;
 * }));
 * // => a Promise of 76
 */

function spread(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  start = start == null ? 0 : nativeMax(toInteger(start), 0);
  return baseRest(function (args) {
    var array = args[start],
        otherArgs = castSlice(args, 0, start);

    if (array) {
      arrayPush(otherArgs, array);
    }

    return apply(func, this, otherArgs);
  });
}

const _default = (spread);
export { _default as default };
/*====catalogjs annotation start====
lZWTwq0uL2Rpc3QvMTExLmpzAZPCrS4vZGlzdC8xMzkuanMFk8KsLi9kaXN0LzQ5LmpzCZPCrS4vZGlzdC8xNDAuanMNk8KuLi90b0ludGVnZXIuanMRgadkZWZhdWx0lKFsqF9kZWZhdWx0JcCRkyXAwomlYXBwbHmboWmQwgLAkgMEwADAp2RlZmF1bHSQqWFycmF5UHVzaJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCoYmFzZVJlc3SboWmQwgrAkgsMwALAp2RlZmF1bHSQqWNhc3RTbGljZZuhaZDCDsCSDxDAA8CnZGVmYXVsdJCpdG9JbnRlZ2Vym6FpkMISwJITFMAEwKdkZWZhdWx0kK9GVU5DX0VSUk9SX1RFWFSboWyQwhbAkhcYwMDAwJCpbmF0aXZlTWF4m6FskaRNYXRowhodkhscwMDAwJCmc3ByZWFkm6Fsl69GVU5DX0VSUk9SX1RFWFSpbmF0aXZlTWF4qXRvSW50ZWdlcqhiYXNlUmVzdKljYXN0U2xpY2WpYXJyYXlQdXNopWFwcGx5wh7Akh8gwMDAwJCoX2RlZmF1bHSboWyRpnNwcmVhZMIiwJIjJMDAwMCQ3AAmlgAAAcDCw5YAGAIFwsKWCQADwMLClgsFwMDCwpYmBcDAwsKWARgGCcLClgkAB8DCwpYLCcDAwsKWKgnABMLClgEXCg3CwpYJAAvAwsKWCwjAwMLClhYIwBDCwpYBGA4RwsKWCQAPwMLClgsJwMDCwpZECcAIwsKWARkSFcLClgkAE8DCwpYLCcDAwsKWAQnADMLCligBFhnCwpYEGBfAwsKWAA/AwMLClksPwBzCwpZbARoewsKWBAAbwMLClgAJwB3CwpYmCcAUwsKWAwjAwMLCls0DoCAfIcLClgkGwBjCwpYEBsDAwsKWAgEiJcLClgYBI8DCwpYACMAgwsKWCQjAwMLClgEOJMDCwg==
====catalogjs annotation end====*/