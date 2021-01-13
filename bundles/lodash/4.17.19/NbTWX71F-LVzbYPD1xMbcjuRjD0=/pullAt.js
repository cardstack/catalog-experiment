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
k5aVwqwuL2Rpc3QvOTguanMDwsCVwqsuL2Rpc3QvMS5qcwbCwJXCqy4vZGlzdC85LmpzCcLAlcKsLi9kaXN0LzI5LmpzDMLAlcKsLi9kaXN0LzUwLmpzD8LAlcKtLi9kaXN0LzEyOC5qcxLCwIGnZGVmYXVsdJShbKZwdWxsQXQfwNwAIZehbwAAA8CRFcCZoWQJAALAkQLAwpihaahhcnJheU1hcJICG8AAp2RlZmF1bHTAwJihcgsIwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaZiYXNlQXSSBRnAAadkZWZhdWx0wMCYoXILBsDAkQTAwpyhaQEWBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmqYmFzZVB1bGxBdJIIGsACp2RlZmF1bHTAwJihcgsKwMCRB8DCnKFpARYHDJDAwgLCwMCZoWQJAAvAkQvAwpihabBjb21wYXJlQXNjZW5kaW5nkgsdwAOnZGVmYXVsdMDAmKFyCxDAwJEKwMKcoWkBFwoPkMDCA8LAwJmhZAkADsCRDsDCmKFpqGZsYXRSZXN0kg4YwASnZGVmYXVsdMDAmKFyCwjAwJENwMKcoWkBFw0SkMDCBMLAwJmhZAkAEcCREcDCmKFpp2lzSW5kZXiSERzABadkZWZhdWx0wMCYoXILB8DAkRDAwpyhaQEYEBOQwMIFwsDAl6FvAQAUHpDAmKFnAAEVwJDAwpmhZAQAFsCTFhQXwMKYoWymcHVsbEF0khYgwMDAFNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3B1bGxBdC5qc5ihcgAGwBeRFcDCmKFnAxcYwJcYGRobHB0VwMKYoXIACMAZkQ3Awpihcl0GwBqRBMDCmKFyFArAG5EHwMKYoXIICMAckQHAwpihcigHwB2REMDCmKFyLBDAwJEKwMKYoWcBAx/AkMDCmKFnCQsgwJEgwMKYoXIABsDAkRXAwg==
====catalogjs annotation end====*/