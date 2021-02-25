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
k5KVwqsuL2VzY2FwZS5qcwPCwJXCrS4vZGlzdC8xNzMuanMHwsCBp2RlZmF1bHSVoWywdGVtcGxhdGVTZXR0aW5ncxrAwNwAHJehbwAAA8CQwJmhZAkAAgSRAsDCmaFpp2VzY2FwZTCSAhjAAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDcDAkMDCmaFkCQAGCJEGwMKZoWmtcmVJbnRlcnBvbGF0ZZIGF8ABp2RlZmF1bHTAwMCYoXILDcDAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgPwMCQwMKXoW8BAAoNkMCYoWcAAQvAkMDCmaFkBBUMwJIMCsDCmaFsqHJlRXNjYXBlkgwVwMDACpDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fcmVFc2NhcGUuanOYoXIACMDAkQvAwpehbwEADhGQwJihZwABD8CQwMKZoWQEFBDAkhAOwMKZoWyqcmVFdmFsdWF0ZZIQFsDAwA6Q2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3JlRXZhbHVhdGUuanOYoXIACsDAkQ/AwpehbwEAEhmQwJihZwABE8CQwMKZoWQEDBTAlhUWFxgUEsDCmaFssHRlbXBsYXRlU2V0dGluZ3OSFBvAwMASkNlQV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RlbXBsYXRlU2V0dGluZ3MuanOYoXIAEMAVkRPAwpihchEIwBaRC8DCmKFyEArAF5EPwMKYoXITDcAYkQXAwpihcj4HwMCRAcDCmKFnAQMawJDAwpihZwkLG8CRG8DCmKFyABDAwJETwMI=
====catalogjs annotation end====*/