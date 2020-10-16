import { default as arrayEach } from "./dist/119.js";
import { default as baseAssignValue } from "./dist/56.js";
import { default as bind } from "./bind.js";
import { default as flatRest } from "./dist/50.js";
import { default as toKey } from "./dist/27.js";






/**
 * Binds methods of an object to the object itself, overwriting the existing
 * method.
 *
 * **Note:** This method doesn't set the "length" property of bound functions.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {Object} object The object to bind and assign the bound methods to.
 * @param {...(string|string[])} methodNames The object method names to bind.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var view = {
 *   'label': 'docs',
 *   'click': function() {
 *     console.log('clicked ' + this.label);
 *   }
 * };
 *
 * _.bindAll(view, ['click']);
 * jQuery(element).on('click', view.click);
 * // => Logs 'clicked docs' when clicked.
 */

var bindAll = flatRest(function (object, methodNames) {
  arrayEach(methodNames, function (key) {
    key = toKey(key);
    baseAssignValue(object, key, bind(object[key], object));
  });
  return object;
});

export { bindAll as default };
/*====catalogjs annotation start====
lZWVwq0uL2Rpc3QvMTE5LmpzAcLAlcKsLi9kaXN0LzU2LmpzBcLAlcKpLi9iaW5kLmpzCcLAlcKsLi9kaXN0LzUwLmpzDcLAlcKsLi9kaXN0LzI3LmpzEcLAgadkZWZhdWx0lKFsp2JpbmRBbGwawJGTGsDAhqlhcnJheUVhY2iboWmQwgLAkgMEwADAp2RlZmF1bHSQr2Jhc2VBc3NpZ25WYWx1ZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCkYmluZJuhaZDCCsCSCwzAAsCnZGVmYXVsdJCoZmxhdFJlc3SboWmQwg7Akg8QwAPAp2RlZmF1bHSQpXRvS2V5m6FpkMISwJITFMAEwKdkZWZhdWx0kKdiaW5kQWxsm6FslahmbGF0UmVzdKlhcnJheUVhY2ildG9LZXmvYmFzZUFzc2lnblZhbHVlpGJpbmTCFhmSFxjAwMDAlalhcnJheUVhY2ivYmFzZUFzc2lnblZhbHVlpGJpbmSoZmxhdFJlc3SldG9LZXncABuWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwnAwMLCliQJwBTCwpYBFwYJwsKWCQAHwMLClgsPwMDCwpYLD8AMwsKWARQKDcLClgkAC8DCwpYLBMDAwsKWDgTAwMLClgEXDhHCwpYJAA/AwsKWCwjAwMLClgAIwATCwpYBFxIVwsKWCQATwMLClgsFwMDCwpYpBcAIwsKWzQK/ARYawsKWBAAXwMLClgAHwBnCwpYJB8DAwsKWAzEQwMLClgIOGMDCwg==
====catalogjs annotation end====*/