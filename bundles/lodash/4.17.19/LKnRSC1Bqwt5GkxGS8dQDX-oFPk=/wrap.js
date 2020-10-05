import { default as castFunction } from "./dist/108.js";
import { default as partial } from "./partial.js";



/**
 * Creates a function that provides `value` to `wrapper` as its first
 * argument. Any additional arguments provided to the function are appended
 * to those provided to the `wrapper`. The wrapper is invoked with the `this`
 * binding of the created function.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {*} value The value to wrap.
 * @param {Function} [wrapper=identity] The wrapper function.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var p = _.wrap(_.escape, function(func, text) {
 *   return '<p>' + func(text) + '</p>';
 * });
 *
 * p('fred, barney, & pebbles');
 * // => '<p>fred, barney, &amp; pebbles</p>'
 */

function wrap(value, wrapper) {
  return partial(castFunction(wrapper), value);
}

const _default = (wrap);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq0uL2Rpc3QvMTA4LmpzAZPCrC4vcGFydGlhbC5qcwWBp2RlZmF1bHSUoWyoX2RlZmF1bHQQwJGTEMDChKxjYXN0RnVuY3Rpb26boWmQwgLAkgMEwADAp2RlZmF1bHSQp3BhcnRpYWyboWmQwgbAkgcIwAHAp2RlZmF1bHSQpHdyYXCboWySp3BhcnRpYWysY2FzdEZ1bmN0aW9uwgnAkgoLwMDAwJCoX2RlZmF1bHSboWyRpHdyYXDCDcCSDg/AwMDAkNwAEZYAAAHAwsOWABgCBcLClgkAA8DCwpYLDMDAwsKWAQzAwMLClgEXBgnCwpYJAAfAwsKWCwfAwMLClhwHwATCwpbNAq4UCgzCwpYJBMAIwsKWBATAwMLClgIBDRDCwpYGAQ7AwsKWAAjAC8LClgkIwMDCwpYBDg/AwsI=
====catalogjs annotation end====*/