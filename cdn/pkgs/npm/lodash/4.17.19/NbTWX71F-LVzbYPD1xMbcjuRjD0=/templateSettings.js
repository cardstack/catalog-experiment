import { default as escape0 } from "./escape.js";
import { default as reInterpolate } from "./dist/173.js";
var reEscape = /<%-([\s\S]+?)%>/g;
var reEvaluate = /<%([\s\S]+?)%>/g;
var templateSettings = {
  'escape': reEscape,
  'evaluate': reEvaluate,
  'interpolate': reInterpolate,
  'variable': '',
  'imports': {
    '_': {
      'escape': escape0
    }
  }
};
export { templateSettings as default };
/*====catalogjs annotation start====
k5KVwqsuL2VzY2FwZS5qcwPCwJXCrS4vZGlzdC8xNzMuanMGwsCBp2RlZmF1bHSVoWywdGVtcGxhdGVTZXR0aW5ncxjAwNwAGpehbwAAA8CQwJmhZAkAAsCRAsDCmaFpp2VzY2FwZTCSAhbAAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAFgEGkMDCAMLAwJmhZAkABcCRBcDCmaFprXJlSW50ZXJwb2xhdGWSBRXAAadkZWZhdWx0wMDAmKFyCw3AwJEEwMKcoWkBGAQHkMDCAcLAwJehbwEACAuQwJihZwABCcCQwMKZoWQEFQrAkgoIwMKZoWyocmVFc2NhcGWSChPAwMAIkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19yZUVzY2FwZS5qc5ihcgAIwMCRCcDCl6FvAQAMD5DAmKFnAAENwJDAwpmhZAQUDsCSDgzAwpmhbKpyZUV2YWx1YXRlkg4UwMDADJDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fcmVFdmFsdWF0ZS5qc5ihcgAKwMCRDcDCl6FvAQAQF5DAmKFnAAERwJDAwpmhZAQMEsCWExQVFhIQwMKZoWywdGVtcGxhdGVTZXR0aW5nc5ISGcDAwBCQ2VBXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdGVtcGxhdGVTZXR0aW5ncy5qc5ihcgAQwBOREcDCmKFyEQjAFJEJwMKYoXIQCsAVkQ3AwpihchMNwBaRBMDCmKFyPgfAwJEBwMKYoWcBAxjAkMDCmKFnCQsZwJEZwMKYoXIAEMDAkRHAwg==
====catalogjs annotation end====*/