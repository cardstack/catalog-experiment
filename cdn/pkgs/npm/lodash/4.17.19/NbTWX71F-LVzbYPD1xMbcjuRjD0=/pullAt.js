import { default as arrayMap } from "./dist/98.js";
import { default as baseAt } from "./dist/1.js";
import { default as basePullAt } from "./dist/9.js";
import { default as compareAscending } from "./dist/29.js";
import { default as flatRest } from "./dist/50.js";
import { default as isIndex } from "./dist/128.js";
var pullAt = flatRest(function (array, indexes) {
  var length = array == null ? 0 : array.length,
      result = baseAt(array, indexes);
  basePullAt(array, arrayMap(indexes, function (index) {
    return isIndex(index, length) ? +index : index;
  }).sort(compareAscending));
  return result;
});
export { pullAt as default };
/*====catalogjs annotation start====
k5aVwqwuL2Rpc3QvOTguanMDwsCVwqsuL2Rpc3QvMS5qcwbCwJXCqy4vZGlzdC85LmpzCcLAlcKsLi9kaXN0LzI5LmpzDMLAlcKsLi9kaXN0LzUwLmpzD8LAlcKtLi9kaXN0LzEyOC5qcxLCwIGnZGVmYXVsdJWhbKZwdWxsQXQfwMDcACGXoW8AAAPAkRXAmaFkCQACwJECwMKZoWmoYXJyYXlNYXCSAhvAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFppmJhc2VBdJIFGcABp2RlZmF1bHTAwMCYoXILBsDAkQTAwpyhaQEWBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmqYmFzZVB1bGxBdJIIGsACp2RlZmF1bHTAwMCYoXILCsDAkQfAwpyhaQEWBwyQwMICwsDAmaFkCQALwJELwMKZoWmwY29tcGFyZUFzY2VuZGluZ5ILHcADp2RlZmF1bHTAwMCYoXILEMDAkQrAwpyhaQEXCg+QwMIDwsDAmaFkCQAOwJEOwMKZoWmoZmxhdFJlc3SSDhjABKdkZWZhdWx0wMDAmKFyCwjAwJENwMKcoWkBFw0SkMDCBMLAwJmhZAkAEcCREcDCmaFpp2lzSW5kZXiSERzABadkZWZhdWx0wMDAmKFyCwfAwJEQwMKcoWkBGBATkMDCBcLAwJehbwEAFB6QwJihZwABFcCQwMKZoWQEABbAkxYUF8DCmaFspnB1bGxBdJIWIMDAwBSQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcHVsbEF0LmpzmKFyAAbAF5EVwMKYoWcDFxjAlhgZGhscHcDCmKFyAAjAGZENwMKYoXJdBsAakQTAwpihchQKwBuRB8DCmKFyCAjAHJEBwMKYoXIoB8AdkRDAwpihciwQwMCRCsDCmKFnAQMfwJDAwpihZwkLIMCRIMDCmKFyAAbAwJEVwMI=
====catalogjs annotation end====*/