import { default as arrayMap } from "./dist/98.js";
import { default as createOver } from "./dist/5.js";



/**
 * Creates a function that invokes `iteratees` with the arguments it receives
 * and returns their results.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Util
 * @param {...(Function|Function[])} [iteratees=[_.identity]]
 *  The iteratees to invoke.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var func = _.over([Math.max, Math.min]);
 *
 * func(1, 2, 3, 4);
 * // => [4, 1]
 */

var over = createOver(arrayMap);
const _default = (over);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvOTguanMBk8KrLi9kaXN0LzUuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EsCRkxLAwoSoYXJyYXlNYXCboWmQwgLAkgMEwADAp2RlZmF1bHSQqmNyZWF0ZU92ZXKboWmQwgbAkgcIwAHAp2RlZmF1bHSQpG92ZXKboWySqmNyZWF0ZU92ZXKoYXJyYXlNYXDCCg2SCwzAwMDAkqhhcnJheU1hcKpjcmVhdGVPdmVyqF9kZWZhdWx0m6FskaRvdmVywg/AkhARwMDAwJDcABOWAAABwMLDlgAXAgXCwpYJAAPAwsKWCwjAwMLClgEIwMDCwpYBFgYJwsKWCQAHwMLClgsKwMDCwpYACsAEwsKWzQGnAQoOwsKWBAALwMLClgAEwA3CwpYEBMDAwsKWAwEIwMLClgEBDxLCwpYGARDAwsKWAAjADMLClgkIwMDCwpYBDhHAwsI=
====catalogjs annotation end====*/