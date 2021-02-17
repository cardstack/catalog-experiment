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
k5aVwq0uL2Rpc3QvMTAzLmpzA8LAlcKtLi9kaXN0LzEwNC5qcwfCwJXCqy4vZGlzdC8xLmpzC8LAlcKsLi9kaXN0LzUwLmpzD8LAlcKtLi9kaXN0LzEyOC5qcxPCwJXCqS4vdGhydS5qcxfCwIGnZGVmYXVsdJWhbKl3cmFwcGVyQXQlwMDcACeXoW8AAAPAkRvAmaFkCQACBJECwMKZoWmrTGF6eVdyYXBwZXKSAiDAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcID8DAkMDCmaFkCQAGCJEGwMKZoWmtTG9kYXNoV3JhcHBlcpIGI8ABp2RlZmF1bHTAwMCYoXILDcDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgPwMCQwMKZoWQJAAoMkQrAwpmhaaZiYXNlQXSSCh/AAqdkZWZhdWx0wMDAmKFyCwbAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIDcDAkMDCmaFkCQAOEJEOwMKZoWmoZmxhdFJlc3SSDh7AA6dkZWZhdWx0wMDAmKFyCwjAwJENwMKcoWkBAQ0TkRDAwgPCwMCYoWcIDsDAkMDCmaFkCQASFJESwMKZoWmnaXNJbmRleJISIcAEp2RlZmF1bHTAwMCYoXILB8DAkRHAwpyhaQEBEReRFMDCBMLAwJihZwgPwMCQwMKZoWQJABYYkRbAwpmhaaR0aHJ1khYiwAWnZGVmYXVsdMDAwJihcgsEwMCRFcDCnKFpAQEVGZEYwMIFwsDAmKFnCAvAwJDAwpehbwEAGiSQwJihZwABG8CQwMKZoWQEABzAkxwaHcDCmaFsqXdyYXBwZXJBdJIcJsDAwBqQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvd3JhcHBlckF0LmpzmKFyAAnAHZEbwMKYoWcDzJEewJYeHyAhIiPAwpihcgAIwB+RDcDCmKFyzKkGwCCRCcDCmKFyWQvAIZEBwMKYoXIGB8AikRHAwpihcsyUBMAjkRXAwpihckoNwMCRBcDCmKFnAQMlwJDAwpihZwkLJsCRJsDCmKFyAAnAwJEbwMI=
====catalogjs annotation end====*/