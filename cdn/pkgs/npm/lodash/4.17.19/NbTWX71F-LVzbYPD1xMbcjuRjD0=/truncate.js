import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as hasUnicode } from "./dist/145.js";
import { default as isObject } from "./isObject.js";
import { default as isRegExp } from "./isRegExp.js";
import { default as stringSize } from "./dist/144.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString0 } from "./toString.js";
var DEFAULT_TRUNC_LENGTH = 30,
    DEFAULT_TRUNC_OMISSION = '...';
var reFlags = /\w*$/;
function truncate(string, options) {
  var length = DEFAULT_TRUNC_LENGTH,
      omission = DEFAULT_TRUNC_OMISSION;

  if (isObject(options)) {
    var separator = 'separator' in options ? options.separator : separator;
    length = 'length' in options ? toInteger(options.length) : length;
    omission = 'omission' in options ? baseToString(options.omission) : omission;
  }

  string = toString0(string);
  var strLength = string.length;

  if (hasUnicode(string)) {
    var strSymbols = stringToArray(string);
    strLength = strSymbols.length;
  }

  if (length >= strLength) {
    return string;
  }

  var end = length - stringSize(omission);

  if (end < 1) {
    return omission;
  }

  var result = strSymbols ? castSlice(strSymbols, 0, end).join('') : string.slice(0, end);

  if (separator === undefined) {
    return result + omission;
  }

  if (strSymbols) {
    end += result.length - end;
  }

  if (isRegExp(separator)) {
    if (string.slice(end).search(separator)) {
      var match,
          substring = result;

      if (!separator.global) {
        separator = RegExp(separator.source, toString0(reFlags.exec(separator)) + 'g');
      }

      separator.lastIndex = 0;

      while (match = separator.exec(substring)) {
        var newEnd = match.index;
      }

      result = result.slice(0, newEnd === undefined ? end : newEnd);
    }
  } else if (string.indexOf(baseToString(separator), end) != end) {
    var index = result.lastIndexOf(separator);

    if (index > -1) {
      result = result.slice(0, index);
    }
  }

  return result + omission;
}
export { truncate as default };
/*====catalogjs annotation start====
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
====catalogjs annotation end====*/