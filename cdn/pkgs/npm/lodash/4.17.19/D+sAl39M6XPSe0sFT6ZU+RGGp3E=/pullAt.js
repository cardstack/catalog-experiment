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
k5aVwqwuL2Rpc3QvOTguanMDwsCVwqsuL2Rpc3QvMS5qcwfCwJXCqy4vZGlzdC85LmpzC8LAlcKsLi9kaXN0LzI5LmpzD8LAlcKsLi9kaXN0LzUwLmpzE8LAlcKtLi9kaXN0LzEyOC5qcxfCwIGnZGVmYXVsdJWhbKZwdWxsQXQlwMDcACeXoW8AAAPAkRvAmaFkCQACBJECwMKZoWmoYXJyYXlNYXCSAiHAAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmmYmFzZUF0kgYfwAGnZGVmYXVsdMDAwJihcgsGwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA3AwJDAwpmhZAkACgyRCsDCmaFpqmJhc2VQdWxsQXSSCiDAAqdkZWZhdWx0wMDAmKFyCwrAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIDcDAkMDCmaFkCQAOEJEOwMKZoWmwY29tcGFyZUFzY2VuZGluZ5IOI8ADp2RlZmF1bHTAwMCYoXILEMDAkQ3AwpyhaQEBDROREMDCA8LAwJihZwgOwMCQwMKZoWQJABIUkRLAwpmhaahmbGF0UmVzdJISHsAEp2RlZmF1bHTAwMCYoXILCMDAkRHAwpyhaQEBEReRFMDCBMLAwJihZwgOwMCQwMKZoWQJABYYkRbAwpmhaadpc0luZGV4khYiwAWnZGVmYXVsdMDAwJihcgsHwMCRFcDCnKFpAQEVGZEYwMIFwsDAmKFnCA/AwJDAwpehbwEAGiSQwJihZwABG8CQwMKZoWQEABzAkxwaHcDCmaFspnB1bGxBdJIcJsDAwBqQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcHVsbEF0LmpzmKFyAAbAHZEbwMKYoWcDFx7Alh4fICEiI8DCmKFyAAjAH5ERwMKYoXJdBsAgkQXAwpihchQKwCGRCcDCmKFyCAjAIpEBwMKYoXIoB8AjkRXAwpihciwQwMCRDcDCmKFnAQMlwJDAwpihZwkLJsCRJsDCmKFyAAbAwJEbwMI=
====catalogjs annotation end====*/