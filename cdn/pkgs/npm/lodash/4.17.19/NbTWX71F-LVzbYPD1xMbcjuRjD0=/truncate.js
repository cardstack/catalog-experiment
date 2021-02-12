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