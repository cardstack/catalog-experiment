/**
 * Gets the first element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias first
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the first element of `array`.
 * @example
 *
 * _.head([1, 2, 3]);
 * // => 1
 *
 * _.head([]);
 * // => undefined
 */
function head(array) {
  return array && array.length ? array[0] : undefined;
}


export { head as default };
/*====catalogjs annotation start====
lZCBp2RlZmF1bHSUoWykaGVhZATAkZMEwMCBpGhlYWSboWyQwgHAkgIDwMDAwJCVlgAAAcDCw5bNATVCAgTCwpYJBMDAwsKWCQTAwMLClgMOA8DCwg==
====catalogjs annotation end====*/