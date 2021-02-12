import { default as arrayEach } from "./119.js";
import { default as arrayIncludes } from "./120.js";
import { default as setToString } from "./51.js";
var reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/,
    reSplitDetails = /,? & /;
function getWrapDetails(source) {
  var match = source.match(reWrapDetails);
  return match ? match[1].split(reSplitDetails) : [];
}
var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/;
function insertWrapDetails(source, details) {
  var length = details.length;

  if (!length) {
    return source;
  }

  var lastIndex = length - 1;
  details[lastIndex] = (length > 1 ? '& ' : '') + details[lastIndex];
  details = details.join(length > 2 ? ', ' : ' ');
  return source.replace(reWrapComment, '{\n/* [wrapped with ' + details + '] */\n');
}
var WRAP_BIND_FLAG = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_CURRY_FLAG = 8,
    WRAP_CURRY_RIGHT_FLAG = 16,
    WRAP_PARTIAL_FLAG = 32,
    WRAP_PARTIAL_RIGHT_FLAG = 64,
    WRAP_ARY_FLAG = 128,
    WRAP_REARG_FLAG = 256,
    WRAP_FLIP_FLAG = 512;
var wrapFlags = [['ary', WRAP_ARY_FLAG], ['bind', WRAP_BIND_FLAG], ['bindKey', WRAP_BIND_KEY_FLAG], ['curry', WRAP_CURRY_FLAG], ['curryRight', WRAP_CURRY_RIGHT_FLAG], ['flip', WRAP_FLIP_FLAG], ['partial', WRAP_PARTIAL_FLAG], ['partialRight', WRAP_PARTIAL_RIGHT_FLAG], ['rearg', WRAP_REARG_FLAG]];
function updateWrapDetails(details, bitmask) {
  arrayEach(wrapFlags, function (pair) {
    var value = '_.' + pair[0];

    if (bitmask & pair[1] && !arrayIncludes(details, value)) {
      details.push(value);
    }
  });
  return details.sort();
}
function setWrapToString(wrapper, reference, bitmask) {
  var source = reference + '';
  return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
}
export { setWrapToString as default };
/*====catalogjs annotation start====
k5OVwqguLzExOS5qcwPCwJXCqC4vMTIwLmpzBsLAlcKnLi81MS5qcwnCwIGnZGVmYXVsdJWhbK9zZXRXcmFwVG9TdHJpbmdIwMDcAEqXoW8AAAPAkMCZoWQJAALAkQLAwpmhaalhcnJheUVhY2iSAj3AAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAEwEGkMDCAMLAwJmhZAkABcCRBcDCmaFprWFycmF5SW5jbHVkZXOSBT/AAadkZWZhdWx0wMDAmKFyCw3AwJEEwMKcoWkBEwQJkMDCAcLAwJmhZAkACMCRCMDCmaFpq3NldFRvU3RyaW5nkghDwAKnZGVmYXVsdMDAwJihcgsLwMCRB8DCnKFpARIHCpDAwgLCwMCXoW8BAAsUkMCYoWcAAQwQkMDCmaFkBCYNDpINC8DCmaFsrXJlV3JhcERldGFpbHOSDRLAwMALkNlPV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19nZXRXcmFwRGV0YWlscy5qc5ihcgANwMCRDMDCmaFkBgoPwJIPC8DCmaFsrnJlU3BsaXREZXRhaWxzkg8TwMDAC5DZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZ2V0V3JhcERldGFpbHMuanOYoXIADsDAkQ7AwpmhZAEJEcCVEhMRDA7AwpmhbK5nZXRXcmFwRGV0YWlsc5IRRsDAwMCQ2U9XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldFdyYXBEZXRhaWxzLmpzmKFyCQ7AEpEQwMKYoXImDcATkQzAwpihciMOwMCRDsDCl6FvAQAVG5DAmKFnAAEWGJDAwpmhZAQuF8CSFxXAwpmhbK1yZVdyYXBDb21tZW50khcawMDAFZDZUlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faW5zZXJ0V3JhcERldGFpbHMuanOYoXIADcDAkRbAwpmhZAExGcCTGhkWwMKZoWyxaW5zZXJ0V3JhcERldGFpbHOSGUTAwMDAkNlSV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19pbnNlcnRXcmFwRGV0YWlscy5qc5ihcgkRwBqRGMDCmKFyzQEMDcDAkRbAwpehbwEAHECQwJihZwABHS+QwMKZoWQEBB4fkh4cwMKZoWyuV1JBUF9CSU5EX0ZMQUeSHjPAwMAckNlSV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191cGRhdGVXcmFwRGV0YWlscy5qc5ihcgAOwMCRHcDCmaFkBgQgIZIgHMDCmaFssldSQVBfQklORF9LRVlfRkxBR5IgNMDAwByQ2VJXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VwZGF0ZVdyYXBEZXRhaWxzLmpzmKFyABLAwJEfwMKZoWQGBCIjkiIcwMKZoWyvV1JBUF9DVVJSWV9GTEFHkiI1wMDAHJDZUlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdXBkYXRlV3JhcERldGFpbHMuanOYoXIAD8DAkSHAwpmhZAYFJCWSJBzAwpmhbLVXUkFQX0NVUlJZX1JJR0hUX0ZMQUeSJDbAwMAckNlSV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191cGRhdGVXcmFwRGV0YWlscy5qc5ihcgAVwMCRI8DCmaFkBgUmJ5ImHMDCmaFssVdSQVBfUEFSVElBTF9GTEFHkiY4wMDAHJDZUlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdXBkYXRlV3JhcERldGFpbHMuanOYoXIAEcDAkSXAwpmhZAYFKCmSKBzAwpmhbLdXUkFQX1BBUlRJQUxfUklHSFRfRkxBR5IoOcDAwByQ2VJXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VwZGF0ZVdyYXBEZXRhaWxzLmpzmKFyABfAwJEnwMKZoWQGBiorkiocwMKZoWytV1JBUF9BUllfRkxBR5IqMsDAwByQ2VJXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VwZGF0ZVdyYXBEZXRhaWxzLmpzmKFyAA3AwJEpwMKZoWQGBiwtkiwcwMKZoWyvV1JBUF9SRUFSR19GTEFHkiw6wMDAHJDZUlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdXBkYXRlV3JhcERldGFpbHMuanOYoXIAD8DAkSvAwpmhZAYGLsCSLhzAwpmhbK5XUkFQX0ZMSVBfRkxBR5IuN8DAwByQ2VJXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VwZGF0ZVdyYXBEZXRhaWxzLmpzmKFyAA7AwJEtwMKYoWcBATA7kMDCmaFkBAIxwNwAFDIzNDU2Nzg5OjEvKR0fISMtJScrwMKZoWypd3JhcEZsYWdzkjE+wMDAL5DZUlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdXBkYXRlV3JhcERldGFpbHMuanOYoXIACcAykTDAwpihcgwNwDORKcDCmKFyDA7ANJEdwMKYoXIPEsA1kR/Awpihcg0PwDaRIcDCmKFyEhXAN5EjwMKYoXIMDsA4kS3Awpihcg8RwDmRJcDCmKFyFBfAOpEnwMKYoXIND8DAkSvAwpmhZAFVPMCVPT4/PDDAwpmhbLF1cGRhdGVXcmFwRGV0YWlsc5I8RcDAwMCQ2VJXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VwZGF0ZVdyYXBEZXRhaWxzLmpzmKFyCRHAPZE7wMKYoXIXCcA+kQHAwpihcgEJwD+RMMDCmKFyUw3AwJEEwMKXoW8BAEFHkMCZoWQAF0LAlUNERUZCwMKZoWyvc2V0V3JhcFRvU3RyaW5nkkJJwMDAwJDZUFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fc2V0V3JhcFRvU3RyaW5nLmpzmKFyCQ/AQ5FBwMKYoXJIC8BEkQfAwpihcgoRwEWRGMDCmKFyCRHARpE7wMKYoXIBDsDAkRDAwpihZwEDSMCQwMKYoWcJC0nAkUnAwpihcgAPwMCRQcDC
====catalogjs annotation end====*/