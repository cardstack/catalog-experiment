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


export { now as default };
/*====catalogjs annotation start====
lZGVwqwuL2Rpc3QvOTMuanMBwsCBp2RlZmF1bHSUoWyjbm93CcCRkwnAwIKkcm9vdJuhaZDCAsCSAwTAAMCnZGVmYXVsdJCjbm93m6FskaRyb290wgbAkgcIwMDAwJCalgAAAcDCw5YAFwIFwsKWCQADwMLClgsEwMDCwpYaBMDAwsKWzQGhAQYJwsKWBA4HwMLClgADwATCwpYJA8DAwsKWAw4IwMLC
====catalogjs annotation end====*/