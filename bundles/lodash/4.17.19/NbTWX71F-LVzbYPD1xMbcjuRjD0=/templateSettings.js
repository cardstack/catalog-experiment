import { default as escape } from "./escape.js";
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
      'escape': escape
    }
  }
};
export { templateSettings as default };
/*====catalogjs annotation start====
k5KVwqsuL2VzY2FwZS5qcwPCwJXCrS4vZGlzdC8xNzMuanMGwsCBp2RlZmF1bHSUoWywdGVtcGxhdGVTZXR0aW5ncxjA3AAal6FvAAADwJMJDRHAmaFkCQACwJECwMKYoWmmZXNjYXBlkgIWwACnZGVmYXVsdMDAmKFyCwbAwJEBwMKcoWkAFgEGkMDCAMLAwJmhZAkABcCRBcDCmKFprXJlSW50ZXJwb2xhdGWSBRXAAadkZWZhdWx0wMCYoXILDcDAkQTAwpyhaQEYBAeQwMIBwsDAl6FvAQAIC5DAmKFnAAEJwJDAwpmhZAQVCsCSCgjAwpihbKhyZUVzY2FwZZIKE8DAwAjZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fcmVFc2NhcGUuanOYoXIACMDAkQnAwpehbwEADA+QwJihZwABDcCQwMKZoWQEFA7Akg4MwMKYoWyqcmVFdmFsdWF0ZZIOFMDAwAzZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fcmVFdmFsdWF0ZS5qc5ihcgAKwMCRDcDCl6FvAQAQF5DAmKFnAAERwJDAwpmhZAQMEsCWExQVFhIQwMKYoWywdGVtcGxhdGVTZXR0aW5nc5ISGcDAwBDZUFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90ZW1wbGF0ZVNldHRpbmdzLmpzmKFyABDAE5ERwMKYoXIRCMAUkQnAwpihchAKwBWRDcDCmKFyEw3AFpEEwMKYoXI+BsDAkQHAwpihZwEDGMCQwMKYoWcJCxnAkRnAwpihcgAQwMCREcDC
====catalogjs annotation end====*/