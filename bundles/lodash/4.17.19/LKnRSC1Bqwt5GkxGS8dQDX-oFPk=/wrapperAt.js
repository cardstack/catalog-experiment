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
const _default = (wrapperAt);
export { _default as default };
/*====catalogjs annotation start====
lZaTwq0uL2Rpc3QvMTAzLmpzAZPCrS4vZGlzdC8xMDQuanMFk8KrLi9kaXN0LzEuanMJk8KsLi9kaXN0LzUwLmpzDZPCrS4vZGlzdC8xMjguanMRk8KpLi90aHJ1LmpzFYGnZGVmYXVsdJShbKhfZGVmYXVsdCLAkZMiwMKIq0xhenlXcmFwcGVym6FpkMICwJIDBMAAwKdkZWZhdWx0kK1Mb2Rhc2hXcmFwcGVym6FpkMIGwJIHCMABwKdkZWZhdWx0kKZiYXNlQXSboWmQwgrAkgsMwALAp2RlZmF1bHSQqGZsYXRSZXN0m6FpkMIOwJIPEMADwKdkZWZhdWx0kKdpc0luZGV4m6FpkMISwJITFMAEwKdkZWZhdWx0kKR0aHJ1m6FpkMIWwJIXGMAFwKdkZWZhdWx0kKl3cmFwcGVyQXSboWyWqGZsYXRSZXN0pmJhc2VBdKtMYXp5V3JhcHBlcqdpc0luZGV4pHRocnWtTG9kYXNoV3JhcHBlcsIaHZIbHMDAwMCWq0xhenlXcmFwcGVyrUxvZGFzaFdyYXBwZXKmYmFzZUF0qGZsYXRSZXN0p2lzSW5kZXikdGhydahfZGVmYXVsdJuhbJGpd3JhcHBlckF0wh/AkiAhwMDAwJDcACOWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwvAwMLCllkLwBTCwpYBGAYJwsKWCQAHwMLClgsNwMDCwpZKDcDAwsKWARYKDcLClgkAC8DCwpYLBsDAwsKWzKkGwATCwpYBFw4RwsKWCQAPwMLClgsIwMDCwpYACMAMwsKWARgSFcLClgkAE8DCwpYLB8DAwsKWBgfAGMLClgEUFhnCwpYJABfAwsKWCwTAwMLClsyUBMAIwsKWzQGKARoewsKWBAAbwMLClgAJwB3CwpYECcDAwsKWA8yREMDCwpYBAR8iwsKWBgEgwMLClgAIwBzCwpYJCMDAwsKWAQ4hwMLC
====catalogjs annotation end====*/