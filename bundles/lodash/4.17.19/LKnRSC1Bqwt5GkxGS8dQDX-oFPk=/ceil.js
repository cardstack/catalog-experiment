import { default as createRound } from "./dist/20.js";


/**
 * Computes `number` rounded up to `precision`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Math
 * @param {number} number The number to round up.
 * @param {number} [precision=0] The precision to round up to.
 * @returns {number} Returns the rounded up number.
 * @example
 *
 * _.ceil(4.006);
 * // => 5
 *
 * _.ceil(6.004, 2);
 * // => 6.01
 *
 * _.ceil(6040, -2);
 * // => 6100
 */

var ceil = createRound('ceil');
const _default = (ceil);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvMjAuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DsCRkw7AwoOrY3JlYXRlUm91bmSboWmQwgLAkgMEwADAp2RlZmF1bHSQpGNlaWyboWyRq2NyZWF0ZVJvdW5kwgYJkgcIwMDAwJGrY3JlYXRlUm91bmSoX2RlZmF1bHSboWyRpGNlaWzCC8CSDA3AwMDAkJ+WAAABwMLDlgAXAgXCwpYJAAPAwsKWCwvAwMLClgALwMDCwpbNAZkBBgrCwpYEAAfAwsKWAATACcLClgQEwMDCwpYDCATAwsKWAQELDsLClgYBDMDCwpYACMAIwsKWCQjAwMLClgEODcDCwg==
====catalogjs annotation end====*/