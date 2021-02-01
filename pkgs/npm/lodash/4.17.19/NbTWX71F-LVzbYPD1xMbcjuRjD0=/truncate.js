import { default as baseToString } from "./dist/22.js";
import { default as castSlice } from "./dist/140.js";
import { default as hasUnicode } from "./dist/145.js";
import { default as isObject } from "./isObject.js";
import { default as isRegExp } from "./isRegExp.js";
import { default as stringSize } from "./dist/144.js";
import { default as stringToArray } from "./dist/143.js";
import { default as toInteger } from "./toInteger.js";
import { default as toString } from "./toString.js";
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

  string = toString(string);
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
        separator = RegExp(separator.source, toString(reFlags.exec(separator)) + 'g');
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