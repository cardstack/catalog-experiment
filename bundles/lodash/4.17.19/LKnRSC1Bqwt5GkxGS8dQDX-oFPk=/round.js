import { default as createRound } from "./dist/20.js";


/**
 * Computes `number` rounded to `precision`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Math
 * @param {number} number The number to round.
 * @param {number} [precision=0] The precision to round to.
 * @returns {number} Returns the rounded number.
 * @example
 *
 * _.round(4.006);
 * // => 4
 *
 * _.round(4.006, 2);
 * // => 4.01
 *
 * _.round(4060, -2);
 * // => 4100
 */

var round = createRound('round');

export { round as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvMjAuanMBwsCBp2RlZmF1bHSUoWylcm91bmQKwJGTCsDAgqtjcmVhdGVSb3VuZJuhaZDCAsCSAwTAAMCnZGVmYXVsdJClcm91bmSboWyRq2NyZWF0ZVJvdW5kwgYJkgcIwMDAwJGrY3JlYXRlUm91bmSblgAAAcDCw5YAFwIFwsKWCQADwMLClgsLwMDCwpYAC8DAwsKWzQGQAQYKwsKWBAAHwMLClgAFwAnCwpYJBcDAwsKWAwkEwMLClgIOCMDCwg==
====catalogjs annotation end====*/