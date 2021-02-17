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
k5aVwqguLzEzNC5qcwPCwJXCsS4uL2lzQXJndW1lbnRzLmpzB8LAlcKtLi4vaXNBcnJheS5qcwvCwJXCri4uL2lzQnVmZmVyLmpzD8LAlcKoLi8xMjguanMTwsCVwrIuLi9pc1R5cGVkQXJyYXkuanMXwsCBp2RlZmF1bHSVoWytYXJyYXlMaWtlS2V5cyvAwNwALZehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqWJhc2VUaW1lc5ICJ8AAp2RlZmF1bHTAwMCYoXILCcDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgKwMCQwMKZoWQJAAYIkQbAwpmhaatpc0FyZ3VtZW50c5IGJMABp2RlZmF1bHTAwMCYoXILC8DAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgTwMCQwMKZoWQJAAoMkQrAwpmhaadpc0FycmF5kgojwAKnZGVmYXVsdMDAwJihcgsHwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCA/AwJDAwpmhZAkADhCRDsDCmaFpqGlzQnVmZmVykg4lwAOnZGVmYXVsdMDAwJihcgsIwMCRDcDCnKFpAQENE5EQwMIDwsDAmKFnCBDAwJDAwpmhZAkAEhSREsDCmaFpp2lzSW5kZXiSEinABKdkZWZhdWx0wMDAmKFyCwfAwJERwMKcoWkBAREXkRTAwgTCwMCYoWcICsDAkMDCmaFkCQAWGJEWwMKZoWmsaXNUeXBlZEFycmF5khYmwAWnZGVmYXVsdMDAwJihcgsMwMCRFcDCnKFpAQEVGZEYwMIFwsDAmKFnCBTAwJDAwpehbwEAGiqQwJihZwABGx2QwMKZoWQEExzAkhwawMKZoWyrb2JqZWN0UHJvdG+SHCDAwMAakNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19hcnJheUxpa2VLZXlzLmpzmKFyAAvAwJEbwMKYoWcBAR4hkMDCmaFkBA8fwJQgHx0bwMKZoWyvaGFzT3duUHJvcGVydHkwkh8owMDAHZDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYXJyYXlMaWtlS2V5cy5qc5ihcgAPwCCRHsDCmKFyAwvAwJEbwMKZoWQBSCLAmSMkJSYnKCkiHsDCmaFsrWFycmF5TGlrZUtleXOSIizAwMDAkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19hcnJheUxpa2VLZXlzLmpzmKFyCQ3AI5EhwMKYoXIjB8AkkQnAwpihciELwCWRBcDCmKFyLAjAJpENwMKYoXI3DMAnkRXAwpihcl4JwCiRAcDCmKFybQ/AKZEewMKYoXLMugfAwJERwMKYoWcBAyvAkMDCmKFnCQsswJEswMKYoXIADcDAkSHAwg==
====catalogjs annotation end====*/