import { default as LazyWrapper } from "./dist/103.js";
import { default as LodashWrapper } from "./dist/104.js";
import { default as baseAt } from "./dist/1.js";
import { default as flatRest } from "./dist/50.js";
import { default as isIndex } from "./dist/128.js";
import { default as thru } from "./thru.js";
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
k5aVwq0uL2Rpc3QvMTAzLmpzA8LAlcKtLi9kaXN0LzEwNC5qcwbCwJXCqy4vZGlzdC8xLmpzCcLAlcKsLi9kaXN0LzUwLmpzDMLAlcKtLi9kaXN0LzEyOC5qcw/CwJXCqS4vdGhydS5qcxLCwIGnZGVmYXVsdJShbKl3cmFwcGVyQXQfwNwAIZehbwAAA8CRFcCZoWQJAALAkQLAwpihaatMYXp5V3JhcHBlcpICGsAAp2RlZmF1bHTAwJihcgsLwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaa1Mb2Rhc2hXcmFwcGVykgUdwAGnZGVmYXVsdMDAmKFyCw3AwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFppmJhc2VBdJIIGcACp2RlZmF1bHTAwJihcgsGwMCRB8DCnKFpARYHDJDAwgLCwMCZoWQJAAvAkQvAwpihaahmbGF0UmVzdJILGMADp2RlZmF1bHTAwJihcgsIwMCRCsDCnKFpARcKD5DAwgPCwMCZoWQJAA7AkQ7Awpihaadpc0luZGV4kg4bwASnZGVmYXVsdMDAmKFyCwfAwJENwMKcoWkBGA0SkMDCBMLAwJmhZAkAEcCREcDCmKFppHRocnWSERzABadkZWZhdWx0wMCYoXILBMDAkRDAwpyhaQEUEBOQwMIFwsDAl6FvAQAUHpDAmKFnAAEVwJDAwpmhZAQAFsCTFhQXwMKYoWypd3JhcHBlckF0khYgwMDAFNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3dyYXBwZXJBdC5qc5ihcgAJwBeRFcDCmKFnA8yRGMCWGBkaGxwdwMKYoXIACMAZkQrAwpihcsypBsAakQfAwpihclkLwBuRAcDCmKFyBgfAHJENwMKYoXLMlATAHZEQwMKYoXJKDcDAkQTAwpihZwEDH8CQwMKYoWcJCyDAkSDAwpihcgAJwMCRFcDC
====catalogjs annotation end====*/