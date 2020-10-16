import { default as LazyWrapper } from "./dist/103.js";
import { default as LodashWrapper } from "./dist/104.js";
import { default as baseAt } from "./dist/1.js";
import { default as flatRest } from "./dist/50.js";
import { default as isIndex } from "./dist/128.js";
import { default as thru } from "./thru.js";







/**
 * This method is the wrapper version of `_.at`.
 *
 * @name at
 * @memberOf _
 * @since 1.0.0
 * @category Seq
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }, 4] };
 *
 * _(object).at(['a[0].b.c', 'a[1]']).value();
 * // => [3, 4]
 */

var wrapperAt = flatRest(function (paths) {
  var length = paths.length,
      start = length ? paths[0] : 0,
      value = this.__wrapped__,
      interceptor = function (object) {
    return baseAt(object, paths);
  };

  if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
    return this.thru(interceptor);
  }

  value = value.slice(start, +start + (length ? 1 : 0));

  value.__actions__.push({
    'func': thru,
    'args': [interceptor],
    'thisArg': undefined
  });

  return new LodashWrapper(value, this.__chain__).thru(function (array) {
    if (length && !array.length) {
      array.push(undefined);
    }

    return array;
  });
});

export { wrapperAt as default };
/*====catalogjs annotation start====
lZaVwq0uL2Rpc3QvMTAzLmpzAcLAlcKtLi9kaXN0LzEwNC5qcwXCwJXCqy4vZGlzdC8xLmpzCcLAlcKsLi9kaXN0LzUwLmpzDcLAlcKtLi9kaXN0LzEyOC5qcxHCwJXCqS4vdGhydS5qcxXCwIGnZGVmYXVsdJShbKl3cmFwcGVyQXQewJGTHsDAh6tMYXp5V3JhcHBlcpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCtTG9kYXNoV3JhcHBlcpuhaZDCBsCSBwjAAcCnZGVmYXVsdJCmYmFzZUF0m6FpkMIKwJILDMACwKdkZWZhdWx0kKhmbGF0UmVzdJuhaZDCDsCSDxDAA8CnZGVmYXVsdJCnaXNJbmRleJuhaZDCEsCSExTABMCnZGVmYXVsdJCkdGhydZuhaZDCFsCSFxjABcCnZGVmYXVsdJCpd3JhcHBlckF0m6FslqhmbGF0UmVzdKZiYXNlQXSrTGF6eVdyYXBwZXKnaXNJbmRleKR0aHJ1rUxvZGFzaFdyYXBwZXLCGh2SGxzAwMDAlqtMYXp5V3JhcHBlcq1Mb2Rhc2hXcmFwcGVypmJhc2VBdKhmbGF0UmVzdKdpc0luZGV4pHRocnXcAB+WAAABwMLDlgAYAgXCwpYJAAPAwsKWCwvAwMLCllkLwBTCwpYBGAYJwsKWCQAHwMLClgsNwMDCwpZKDcDAwsKWARYKDcLClgkAC8DCwpYLBsDAwsKWzKkGwATCwpYBFw4RwsKWCQAPwMLClgsIwMDCwpYACMAMwsKWARgSFcLClgkAE8DCwpYLB8DAwsKWBgfAGMLClgEUFhnCwpYJABfAwsKWCwTAwMLClsyUBMAIwsKWzQGKARoewsKWBAAbwMLClgAJwB3CwpYJCcDAwsKWA8yREMDCwpYCDhzAwsI=
====catalogjs annotation end====*/