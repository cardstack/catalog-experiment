import { default as LazyWrapper } from "./dist/103.js";
import { default as LodashWrapper } from "./dist/104.js";
import { default as baseLodash } from "./dist/114.js";
import { default as isArray } from "./isArray.js";
import { default as isObjectLike } from "./isObjectLike.js";
import { default as wrapperClone } from "./dist/101.js";
var objectProto = Object.prototype;
var hasOwnProperty0 = objectProto.hasOwnProperty;
function lodash(value) {
  if (isObjectLike(value) && !isArray(value) && !(value instanceof LazyWrapper)) {
    if (value instanceof LodashWrapper) {
      return value;
    }

    if (hasOwnProperty0.call(value, '__wrapped__')) {
      return wrapperClone(value);
    }
  }

  return new LodashWrapper(value);
}
lodash.prototype = baseLodash.prototype;
lodash.prototype.constructor = lodash;
export { lodash as default };
/*====catalogjs annotation start====
k5aVwq0uL2Rpc3QvMTAzLmpzA8LAlcKtLi9kaXN0LzEwNC5qcwfCwJXCrS4vZGlzdC8xMTQuanMLwsCVwqwuL2lzQXJyYXkuanMPwsCVwrEuL2lzT2JqZWN0TGlrZS5qcxPCwJXCrS4vZGlzdC8xMDEuanMXwsCBp2RlZmF1bHSVoWymbG9kYXNoMMDA3AAyl6FvAAADwJEqwJmhZAkAAgSRAsDCmaFpq0xhenlXcmFwcGVykgIlwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFprUxvZGFzaFdyYXBwZXKTBiYpwAGnZGVmYXVsdMDAwJihcgsNwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA/AwJDAwpmhZAkACgyRCsDCmaFpqmJhc2VMb2Rhc2iSCizAAqdkZWZhdWx0wMDAmKFyCwrAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcID8DAkMDCmaFkCQAOEJEOwMKZoWmnaXNBcnJheZIOJMADp2RlZmF1bHTAwMCYoXILB8DAkQ3AwpyhaQEBDROREMDCA8LAwJihZwgOwMCQwMKZoWQJABIUkRLAwpmhaaxpc09iamVjdExpa2WSEiPABKdkZWZhdWx0wMDAmKFyCwzAwJERwMKcoWkBAREXkRTAwgTCwMCYoWcIE8DAkMDCmaFkCQAWGJEWwMKZoWmsd3JhcHBlckNsb25lkhYowAWnZGVmYXVsdMDAwJihcgsMwMCRFcDCnKFpAQEVGZEYwMIFwsDAmKFnCA/AwJDAwpehbwEAGi+QwJihZwABGx2QwMKZoWQEExzAkhwawMKZoWyrb2JqZWN0UHJvdG+SHCDAwMAakNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3dyYXBwZXJMb2Rhc2guanOYoXIAC8DAkRvAwpihZwEBHiGQwMKZoWQEDx/AlCAfHRvAwpmhbK9oYXNPd25Qcm9wZXJ0eTCSHyfAwMAdkNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3dyYXBwZXJMb2Rhc2guanOYoXIAD8AgkR7AwpihcgMLwMCRG8DCmaFkAQoiKpkjJCUmJygpIh7AwpmhbKZsb2Rhc2iVIistLjHAwMDAkSrZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy93cmFwcGVyTG9kYXNoLmpzmKFyCQbAI5EhwMKYoXIQDMAkkRHAwpihcgwHwCWRDcDCmKFyHgvAJpEBwMKYoXIeDcAnkQXAwpihcicPwCiRHsDCmKFyLAzAKZEVwMKYoXIhDcDAkQXAwpihZwEBK8CUKywtLsDDmKFyAAbALJEhwMKYoXINCsAtkQnAwpihcgwGwC6RIcDCmKFyGQbAwJEhwMKYoWcBAzDAkMDCmKFnCQsxwJExwMKYoXIABsDAkSHAwg==
====catalogjs annotation end====*/