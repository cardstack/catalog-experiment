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
k5OVwqguLzExOS5qcwPCwJXCqC4vMTIwLmpzB8LAlcKnLi81MS5qcwvCwIGnZGVmYXVsdJWhbK9zZXRXcmFwVG9TdHJpbmdLwMDcAE2XoW8AAAPAkMCZoWQJAAIEkQLAwpmhaalhcnJheUVhY2iSAkDAAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcICsDAkMDCmaFkCQAGCJEGwMKZoWmtYXJyYXlJbmNsdWRlc5IGQsABp2RlZmF1bHTAwMCYoXILDcDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgKwMCQwMKZoWQJAAoMkQrAwpmhaatzZXRUb1N0cmluZ5IKRsACp2RlZmF1bHTAwMCYoXILC8DAkQnAwpyhaQEBCQ2RDMDCAsLAwJihZwgJwMCQwMKXoW8BAA4XkMCYoWcAAQ8TkMDCmaFkBCYQEZIQDsDCmaFsrXJlV3JhcERldGFpbHOSEBXAwMAOkNlPV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19nZXRXcmFwRGV0YWlscy5qc5ihcgANwMCRD8DCmaFkBgoSwJISDsDCmaFsrnJlU3BsaXREZXRhaWxzkhIWwMDADpDZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZ2V0V3JhcERldGFpbHMuanOYoXIADsDAkRHAwpmhZAEJFMCVFRYUDxHAwpmhbK5nZXRXcmFwRGV0YWlsc5IUScDAwMCQ2U9XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldFdyYXBEZXRhaWxzLmpzmKFyCQ7AFZETwMKYoXImDcAWkQ/AwpihciMOwMCREcDCl6FvAQAYHpDAmKFnAAEZG5DAwpmhZAQuGsCSGhjAwpmhbK1yZVdyYXBDb21tZW50khodwMDAGJDZUlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faW5zZXJ0V3JhcERldGFpbHMuanOYoXIADcDAkRnAwpmhZAExHMCTHRwZwMKZoWyxaW5zZXJ0V3JhcERldGFpbHOSHEfAwMDAkNlSV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19pbnNlcnRXcmFwRGV0YWlscy5qc5ihcgkRwB2RG8DCmKFyzQEMDcDAkRnAwpehbwEAH0OQwJihZwABIDKQwMKZoWQEBCEikiEfwMKZoWyuV1JBUF9CSU5EX0ZMQUeSITbAwMAfkNlSV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191cGRhdGVXcmFwRGV0YWlscy5qc5ihcgAOwMCRIMDCmaFkBgQjJJIjH8DCmaFssldSQVBfQklORF9LRVlfRkxBR5IjN8DAwB+Q2VJXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VwZGF0ZVdyYXBEZXRhaWxzLmpzmKFyABLAwJEiwMKZoWQGBCUmkiUfwMKZoWyvV1JBUF9DVVJSWV9GTEFHkiU4wMDAH5DZUlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdXBkYXRlV3JhcERldGFpbHMuanOYoXIAD8DAkSTAwpmhZAYFJyiSJx/AwpmhbLVXUkFQX0NVUlJZX1JJR0hUX0ZMQUeSJznAwMAfkNlSV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL191cGRhdGVXcmFwRGV0YWlscy5qc5ihcgAVwMCRJsDCmaFkBgUpKpIpH8DCmaFssVdSQVBfUEFSVElBTF9GTEFHkik7wMDAH5DZUlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdXBkYXRlV3JhcERldGFpbHMuanOYoXIAEcDAkSjAwpmhZAYFKyySKx/AwpmhbLdXUkFQX1BBUlRJQUxfUklHSFRfRkxBR5IrPMDAwB+Q2VJXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VwZGF0ZVdyYXBEZXRhaWxzLmpzmKFyABfAwJEqwMKZoWQGBi0uki0fwMKZoWytV1JBUF9BUllfRkxBR5ItNcDAwB+Q2VJXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VwZGF0ZVdyYXBEZXRhaWxzLmpzmKFyAA3AwJEswMKZoWQGBi8wki8fwMKZoWyvV1JBUF9SRUFSR19GTEFHki89wMDAH5DZUlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdXBkYXRlV3JhcERldGFpbHMuanOYoXIAD8DAkS7AwpmhZAYGMcCSMR/AwpmhbK5XUkFQX0ZMSVBfRkxBR5IxOsDAwB+Q2VJXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VwZGF0ZVdyYXBEZXRhaWxzLmpzmKFyAA7AwJEwwMKYoWcBATM+kMDCmaFkBAI0wNwAFDU2Nzg5Ojs8PTQyLCAiJCYwKCouwMKZoWypd3JhcEZsYWdzkjRBwMDAMpDZUlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fdXBkYXRlV3JhcERldGFpbHMuanOYoXIACcA1kTPAwpihcgwNwDaRLMDCmKFyDA7AN5EgwMKYoXIPEsA4kSLAwpihcg0PwDmRJMDCmKFyEhXAOpEmwMKYoXIMDsA7kTDAwpihcg8RwDyRKMDCmKFyFBfAPZEqwMKYoXIND8DAkS7AwpmhZAFVP8CVQEFCPzPAwpmhbLF1cGRhdGVXcmFwRGV0YWlsc5I/SMDAwMCQ2VJXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3VwZGF0ZVdyYXBEZXRhaWxzLmpzmKFyCRHAQJE+wMKYoXIXCcBBkQHAwpihcgEJwEKRM8DCmKFyUw3AwJEFwMKXoW8BAERKkMCZoWQAF0XAlUZHSElFwMKZoWyvc2V0V3JhcFRvU3RyaW5nkkVMwMDAwJDZUFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fc2V0V3JhcFRvU3RyaW5nLmpzmKFyCQ/ARpFEwMKYoXJIC8BHkQnAwpihcgoRwEiRG8DCmKFyCRHASZE+wMKYoXIBDsDAkRPAwpihZwEDS8CQwMKYoWcJC0zAkUzAwpihcgAPwMCRRMDC
====catalogjs annotation end====*/