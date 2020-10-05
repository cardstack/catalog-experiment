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
const _default = (bindAll);
export { _default as default };
/*====catalogjs annotation start====
lZWTwq0uL2Rpc3QvMTE5LmpzAZPCrC4vZGlzdC81Ni5qcwWTwqkuL2JpbmQuanMJk8KsLi9kaXN0LzUwLmpzDZPCrC4vZGlzdC8yNy5qcxGBp2RlZmF1bHSUoWyoX2RlZmF1bHQewJGTHsDCh6lhcnJheUVhY2iboWmQwgLAkgMEwADAp2RlZmF1bHSQr2Jhc2VBc3NpZ25WYWx1ZZuhaZDCBsCSBwjAAcCnZGVmYXVsdJCkYmluZJuhaZDCCsCSCwzAAsCnZGVmYXVsdJCoZmxhdFJlc3SboWmQwg7Akg8QwAPAp2RlZmF1bHSQpXRvS2V5m6FpkMISwJITFMAEwKdkZWZhdWx0kKdiaW5kQWxsm6FslahmbGF0UmVzdKlhcnJheUVhY2ildG9LZXmvYmFzZUFzc2lnblZhbHVlpGJpbmTCFhmSFxjAwMDAlalhcnJheUVhY2ivYmFzZUFzc2lnblZhbHVlpGJpbmSoZmxhdFJlc3SldG9LZXmoX2RlZmF1bHSboWyRp2JpbmRBbGzCG8CSHB3AwMDAkNwAH5YAAAHAwsOWABgCBcLClgkAA8DCwpYLCcDAwsKWJAnAFMLClgEXBgnCwpYJAAfAwsKWCw/AwMLClgsPwAzCwpYBFAoNwsKWCQALwMLClgsEwMDCwpYOBMDAwsKWARcOEcLClgkAD8DCwpYLCMDAwsKWAAjABMLClgEXEhXCwpYJABPAwsKWCwXAwMLClikFwAjCwpbNAr8BFhrCwpYEABfAwsKWAAfAGcLClgQHwMDCwpYDMRDAwsKWAQEbHsLClgYBHMDCwpYACMAYwsKWCQjAwMLClgEOHcDCwg==
====catalogjs annotation end====*/