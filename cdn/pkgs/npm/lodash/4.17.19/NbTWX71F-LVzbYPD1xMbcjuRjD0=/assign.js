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
k5aVwqwuL2Rpc3QvNTUuanMDwsCVwqwuL2Rpc3QvNTQuanMGwsCVwqwuL2Rpc3QvNDguanMJwsCVwrAuL2lzQXJyYXlMaWtlLmpzDMLAlcKtLi9kaXN0LzEzMy5qcw/CwJXCqS4va2V5cy5qcxLCwIGnZGVmYXVsdJWhbKZhc3NpZ24nwMDcACmXoW8AAAPAkRzAmaFkCQACwJECwMKZoWmrYXNzaWduVmFsdWWSAiXAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqmNvcHlPYmplY3SSBSLAAadkZWZhdWx0wMDAmKFyCwrAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmaFprmNyZWF0ZUFzc2lnbmVykggfwAKnZGVmYXVsdMDAwJihcgsOwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaatpc0FycmF5TGlrZZILIcADp2RlZmF1bHTAwMCYoXILC8DAkQrAwpyhaQEbCg+QwMIDwsDAmaFkCQAOwJEOwMKZoWmraXNQcm90b3R5cGWSDiDABKdkZWZhdWx0wMDAmKFyCwvAwJENwMKcoWkBGA0SkMDCBMLAwJmhZAkAEcCREcDCmaFppGtleXOSESPABadkZWZhdWx0wMDAmKFyCwTAwJEQwMKcoWkBFBATkMDCBcLAwJehbwEAFCaQwJihZwABFReQwMKZoWQEExbAkhYUwMKZoWyrb2JqZWN0UHJvdG+SFhrAwMAUkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2Fzc2lnbi5qc5ihcgALwMCRFcDCmKFnAQEYG5DAwpmhZAQPGcCUGhkXFcDCmaFsr2hhc093blByb3BlcnR5MJIZJMDAwBeQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYXNzaWduLmpzmKFyAA/AGpEYwMKYoXIDC8DAkRXAwpihZwEBHMCQwMKZoWQEAB3AlB0bHhjAwpmhbKZhc3NpZ26SHSjAwMAbkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2Fzc2lnbi5qc5ihcgAGwB6RHMDCmKFnAygfwJcfICEiIyQlwMKYoXIADsAgkQfAwpihciMLwCGRDcDCmKFyDAvAIpEKwMKYoXIQCsAjkQTAwpihcgkEwCSREMDCmKFySA/AJZEYwMKYoXIcC8DAkQHAwpihZwEDJ8CQwMKYoWcJCyjAkSjAwpihcgAGwMCRHMDC
====catalogjs annotation end====*/