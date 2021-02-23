import { default as assignValue } from "./dist/55.js";
import { default as copyObject } from "./dist/54.js";
import { default as createAssigner } from "./dist/48.js";
import { default as isArrayLike } from "./isArrayLike.js";
import { default as isPrototype } from "./dist/133.js";
import { default as keys } from "./keys.js";
var objectProto = Object.prototype;
var hasOwnProperty0 = objectProto.hasOwnProperty;
var assign = createAssigner(function (object, source) {
  if (isPrototype(source) || isArrayLike(source)) {
    copyObject(source, keys(source), object);
    return;
  }

  for (var key in source) {
    if (hasOwnProperty0.call(source, key)) {
      assignValue(object, key, source[key]);
    }
  }
});
export { assign as default };
/*====catalogjs annotation start====
k5aVwqwuL2Rpc3QvNTUuanMDwsCVwqwuL2Rpc3QvNTQuanMHwsCVwqwuL2Rpc3QvNDguanMLwsCVwrAuL2lzQXJyYXlMaWtlLmpzD8LAlcKtLi9kaXN0LzEzMy5qcxPCwJXCqS4va2V5cy5qcxfCwIGnZGVmYXVsdJWhbKZhc3NpZ24twMDcAC+XoW8AAAPAkSLAmaFkCQACBJECwMKZoWmrYXNzaWduVmFsdWWSAivAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmqY29weU9iamVjdJIGKMABp2RlZmF1bHTAwMCYoXILCsDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgOwMCQwMKZoWQJAAoMkQrAwpmhaa5jcmVhdGVBc3NpZ25lcpIKJcACp2RlZmF1bHTAwMCYoXILDsDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgOwMCQwMKZoWQJAA4QkQ7Awpmhaatpc0FycmF5TGlrZZIOJ8ADp2RlZmF1bHTAwMCYoXILC8DAkQ3AwpyhaQEBDROREMDCA8LAwJihZwgSwMCQwMKZoWQJABIUkRLAwpmhaatpc1Byb3RvdHlwZZISJsAEp2RlZmF1bHTAwMCYoXILC8DAkRHAwpyhaQEBEReRFMDCBMLAwJihZwgPwMCQwMKZoWQJABYYkRbAwpmhaaRrZXlzkhYpwAWnZGVmYXVsdMDAwJihcgsEwMCRFcDCnKFpAQEVGZEYwMIFwsDAmKFnCAvAwJDAwpehbwEAGiyQwJihZwABGx2QwMKZoWQEExzAkhwawMKZoWyrb2JqZWN0UHJvdG+SHCDAwMAakNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2Fzc2lnbi5qc5ihcgALwMCRG8DCmKFnAQEeIZDAwpmhZAQPH8CUIB8dG8DCmaFsr2hhc093blByb3BlcnR5MJIfKsDAwB2Q2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYXNzaWduLmpzmKFyAA/AIJEewMKYoXIDC8DAkRvAwpihZwEBIsCQwMKZoWQEACPAlCMhJB7AwpmhbKZhc3NpZ26SIy7AwMAhkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2Fzc2lnbi5qc5ihcgAGwCSRIsDCmKFnAyglwJclJicoKSorwMKYoXIADsAmkQnAwpihciMLwCeREcDCmKFyDAvAKJENwMKYoXIQCsApkQXAwpihcgkEwCqRFcDCmKFySA/AK5EewMKYoXIcC8DAkQHAwpihZwEDLcCQwMKYoWcJCy7AkS7AwpihcgAGwMCRIsDC
====catalogjs annotation end====*/