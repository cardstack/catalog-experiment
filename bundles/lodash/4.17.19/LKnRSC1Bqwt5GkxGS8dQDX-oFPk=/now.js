import { default as root } from "./dist/93.js";


/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */

var now = function () {
  return root.Date.now();
};

const _default = (now);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqwuL2Rpc3QvOTMuanMBgadkZWZhdWx0lKFsqF9kZWZhdWx0DcCRkw3AwoOkcm9vdJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCjbm93m6FskaRyb290wgbAkgcIwMDAwJCoX2RlZmF1bHSboWyRo25vd8IKwJILDMDAwMCQnpYAAAHAwsOWABcCBcLClgkAA8DCwpYLBMDAwsKWGgTAwMLCls0BoQEGCcLClgQOB8DCwpYAA8AEwsKWBAPAwMLClgIBCg3CwpYGAQvAwsKWAAjACMLClgkIwMDCwpYBDgzAwsI=
====catalogjs annotation end====*/