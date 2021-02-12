import { default as baseTimes } from "./134.js";
import { default as isArguments } from "../isArguments.js";
import { default as isArray } from "../isArray.js";
import { default as isBuffer } from "../isBuffer.js";
import { default as isIndex } from "./128.js";
import { default as isTypedArray } from "../isTypedArray.js";
var objectProto = Object.prototype;
var hasOwnProperty0 = objectProto.hasOwnProperty;
function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty0.call(value, key)) && !(skipIndexes && (key == 'length' || isBuff && (key == 'offset' || key == 'parent') || isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || isIndex(key, length)))) {
      result.push(key);
    }
  }

  return result;
}
export { arrayLikeKeys as default };
/*====catalogjs annotation start====
k5aVwqguLzEzNC5qcwPCwJXCsS4uL2lzQXJndW1lbnRzLmpzBsLAlcKtLi4vaXNBcnJheS5qcwnCwJXCri4uL2lzQnVmZmVyLmpzDMLAlcKoLi8xMjguanMPwsCVwrIuLi9pc1R5cGVkQXJyYXkuanMSwsCBp2RlZmF1bHSVoWytYXJyYXlMaWtlS2V5cyXAwNwAJ5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqWJhc2VUaW1lc5ICIcAAp2RlZmF1bHTAwMCYoXILCcDAkQHAwpyhaQATAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmraXNBcmd1bWVudHOSBR7AAadkZWZhdWx0wMDAmKFyCwvAwJEEwMKcoWkBHAQJkMDCAcLAwJmhZAkACMCRCMDCmaFpp2lzQXJyYXmSCB3AAqdkZWZhdWx0wMDAmKFyCwfAwJEHwMKcoWkBGAcMkMDCAsLAwJmhZAkAC8CRC8DCmaFpqGlzQnVmZmVykgsfwAOnZGVmYXVsdMDAwJihcgsIwMCRCsDCnKFpARkKD5DAwgPCwMCZoWQJAA7AkQ7Awpmhaadpc0luZGV4kg4jwASnZGVmYXVsdMDAwJihcgsHwMCRDcDCnKFpARMNEpDAwgTCwMCZoWQJABHAkRHAwpmhaaxpc1R5cGVkQXJyYXmSESDABadkZWZhdWx0wMDAmKFyCwzAwJEQwMKcoWkBHRATkMDCBcLAwJehbwEAFCSQwJihZwABFReQwMKZoWQEExbAkhYUwMKZoWyrb2JqZWN0UHJvdG+SFhrAwMAUkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19hcnJheUxpa2VLZXlzLmpzmKFyAAvAwJEVwMKYoWcBARgbkMDCmaFkBA8ZwJQaGRcVwMKZoWyvaGFzT3duUHJvcGVydHkwkhkiwMDAF5DZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYXJyYXlMaWtlS2V5cy5qc5ihcgAPwBqRGMDCmKFyAwvAwJEVwMKZoWQBSBzAmR0eHyAhIiMcGMDCmaFsrWFycmF5TGlrZUtleXOSHCbAwMDAkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19hcnJheUxpa2VLZXlzLmpzmKFyCQ3AHZEbwMKYoXIjB8AekQfAwpihciELwB+RBMDCmKFyLAjAIJEKwMKYoXI3DMAhkRDAwpihcl4JwCKRAcDCmKFybQ/AI5EYwMKYoXLMugfAwJENwMKYoWcBAyXAkMDCmKFnCQsmwJEmwMKYoXIADcDAkRvAwg==
====catalogjs annotation end====*/