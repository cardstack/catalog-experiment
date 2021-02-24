import { default as baseGetTag } from "./dist/86.js";
import { default as isLength } from "./isLength.js";
import { default as isObjectLike } from "./isObjectLike.js";
import { default as baseUnary } from "./dist/135.js";
import { default as nodeUtil } from "./dist/94.js";
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';
var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
}
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
export { isTypedArray as default };
/*====catalogjs annotation start====
k5WVwqwuL2Rpc3QvODYuanMDwsCVwq0uL2lzTGVuZ3RoLmpzB8LAlcKxLi9pc09iamVjdExpa2UuanMLwsCVwq0uL2Rpc3QvMTM1LmpzD8LAlcKsLi9kaXN0Lzk0LmpzE8LAgadkZWZhdWx0laFsrGlzVHlwZWRBcnJhecyRwMDcAJOXoW8AAAPAkkvMicCZoWQJAAIEkQLAwpmhaapiYXNlR2V0VGFnkgLMgcAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaahpc0xlbmd0aJIGf8ABp2RlZmF1bHTAwMCYoXILCMDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgPwMCQwMKZoWQJAAoMkQrAwpmhaaxpc09iamVjdExpa2WSCn7AAqdkZWZhdWx0wMDAmKFyCwzAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIE8DAkMDCmaFkCQAOEJEOwMKZoWmpYmFzZVVuYXJ5kg7MjcADp2RlZmF1bHTAwMCYoXILCcDAkQ3AwpyhaQEBDROREMDCA8LAwJihZwgPwMCQwMKZoWQJABIUkRLAwpmhaahub2RlVXRpbJMSzIbMh8AEp2RlZmF1bHTAwMCYoXILCMDAkRHAwpyhaQEBERWRFMDCBMLAwJihZwgOwMCQwMKXoW8BABbMgpDAmKFnAAEXMZDAwpmhZAQXGBmSGBbAwpmhbKdhcmdzVGFnkhhfwMDAFpFL2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc1R5cGVkQXJyYXkuanOYoXIAB8DAkRfAwpmhZAYTGhuSGhbAwpmhbKhhcnJheVRhZ5IaYcDAwBaRS9lRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNUeXBlZEFycmF5LmpzmKFyAAjAwJEZwMKZoWQGFRwdkhwWwMKZoWynYm9vbFRhZ5IcZcDAwBaRS9lRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNUeXBlZEFycmF5LmpzmKFyAAfAwJEbwMKZoWQGEh4fkh4WwMKZoWynZGF0ZVRhZ5IeacDAwBaRS9lRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNUeXBlZEFycmF5LmpzmKFyAAfAwJEdwMKZoWQGEyAhkiAWwMKZoWyoZXJyb3JUYWeSIGvAwMAWkUvZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAIwMCRH8DCmaFkBhYiI5IiFsDCmaFsp2Z1bmNUYWeSIm3AwMAWkUvZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAHwMCRIcDCmaFkBhEkJZIkFsDCmaFspm1hcFRhZ5Ikb8DAwBaRS9lRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNUeXBlZEFycmF5LmpzmKFyAAbAwJEjwMKZoWQGFCYnkiYWwMKZoWypbnVtYmVyVGFnkiZxwMDAFpFL2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc1R5cGVkQXJyYXkuanOYoXIACcDAkSXAwpmhZAYUKCmSKBbAwpmhbKlvYmplY3RUYWeSKHPAwMAWkUvZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAJwMCRJ8DCmaFkBhQqK5IqFsDCmaFsqXJlZ2V4cFRhZ5IqdcDAwBaRS9lRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNUeXBlZEFycmF5LmpzmKFyAAnAwJEpwMKZoWQGESwtkiwWwMKZoWymc2V0VGFnkix3wMDAFpFL2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc1R5cGVkQXJyYXkuanOYoXIABsDAkSvAwpmhZAYULi+SLhbAwpmhbKlzdHJpbmdUYWeSLnnAwMAWkUvZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAJwMCRLcDCmaFkBhUwwJIwFsDCmaFsqndlYWtNYXBUYWeSMHvAwMAWkUvZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAKwMCRL8DCmKFnAQEySJDAwpmhZAQZMzSSMzHAwpmhbK5hcnJheUJ1ZmZlclRhZ5IzY8DAwDGRS9lRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNUeXBlZEFycmF5LmpzmKFyAA7AwJEywMKZoWQGFjU2kjUxwMKZoWyrZGF0YVZpZXdUYWeSNWfAwMAxkUvZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgALwMCRNMDCmaFkBho3OJI3McDCmaFsqmZsb2F0MzJUYWeSN03AwMAxkUvZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAKwMCRNsDCmaFkBho5OpI5McDCmaFsqmZsb2F0NjRUYWeSOU/AwMAxkUvZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAKwMCROMDCmaFkBhc7PJI7McDCmaFsp2ludDhUYWeSO1HAwMAxkUvZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAHwMCROsDCmaFkBhg9PpI9McDCmaFsqGludDE2VGFnkj1TwMDAMZFL2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc1R5cGVkQXJyYXkuanOYoXIACMDAkTzAwpmhZAYYP0CSPzHAwpmhbKhpbnQzMlRhZ5I/VcDAwDGRS9lRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNUeXBlZEFycmF5LmpzmKFyAAjAwJE+wMKZoWQGGEFCkkExwMKZoWyodWludDhUYWeSQVfAwMAxkUvZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAIwMCRQMDCmaFkBh9DRJJDMcDCmaFsr3VpbnQ4Q2xhbXBlZFRhZ5JDWcDAwDGRS9lRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNUeXBlZEFycmF5LmpzmKFyAA/AwJFCwMKZoWQGGUVGkkUxwMKZoWypdWludDE2VGFnkkVbwMDAMZFL2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc1R5cGVkQXJyYXkuanOYoXIACcDAkUTAwpmhZAYZR8CSRzHAwpmhbKl1aW50MzJUYWeSR13AwMAxkUvZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzVHlwZWRBcnJheS5qc5ihcgAJwMCRRsDCmKFnAQFJS5DAwpmhZAQFSsCSSkjAwpmhbK50eXBlZEFycmF5VGFnc9wAGkpMTlBSVFZYWlxeYGJkZmhqbG5wcnR2eHrMgMDAwEiRS9lRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNUeXBlZEFycmF5LmpzmKFyAA7AwJFJwMKYoWcBCkx83AAwTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7wMOYoXIADsBNkUnAwpihcgEKwE6RNsDCmKFyBA7AT5FJwMKYoXIBCsBQkTjAwpihcgQOwFGRScDCmKFyAQfAUpE6wMKYoXIEDsBTkUnAwpihcgEIwFSRPMDCmKFyBA7AVZFJwMKYoXIBCMBWkT7AwpihcgQOwFeRScDCmKFyAQjAWJFAwMKYoXIEDsBZkUnAwpihcgEPwFqRQsDCmKFyBA7AW5FJwMKYoXIBCcBckUTAwpihcgQOwF2RScDCmKFyAQnAXpFGwMKYoXIKDsBfkUnAwpihcgEHwGCRF8DCmKFyBA7AYZFJwMKYoXIBCMBikRnAwpihcgQOwGORScDCmKFyAQ7AZJEywMKYoXIEDsBlkUnAwpihcgEHwGaRG8DCmKFyBA7AZ5FJwMKYoXIBC8BokTTAwpihcgQOwGmRScDCmKFyAQfAapEdwMKYoXIEDsBrkUnAwpihcgEIwGyRH8DCmKFyBA7AbZFJwMKYoXIBB8BukSHAwpihcgQOwG+RScDCmKFyAQbAcJEjwMKYoXIEDsBxkUnAwpihcgEJwHKRJcDCmKFyBA7Ac5FJwMKYoXIBCcB0kSfAwpihcgQOwHWRScDCmKFyAQnAdpEpwMKYoXIEDsB3kUnAwpihcgEGwHiRK8DCmKFyBA7AeZFJwMKYoXIBCcB6kS3AwpihcgQOwHuRScDCmKFyAQrAwJEvwMKZoWQBC33Aln5/zIDMgX1JwMKZoWywYmFzZUlzVHlwZWRBcnJheZJ9zI/AwMDAkNlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNUeXBlZEFycmF5LmpzmKFyCRDAfpF8wMKYoXITDMB/kQnAwpihcgsIwMyAkQXAwpihchQOwMyBkUnAwpihcgEKwMCRAcDCl6FvAQDMg8yQkMCYoWcAAcyEzIiQwMKZoWQEDcyFwJTMhsyHzIXMg8DCmaFssG5vZGVJc1R5cGVkQXJyYXmTzIXMjMyOwMDAzIOQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNUeXBlZEFycmF5LmpzmKFyABDAzIaRzITAwpihcgMIwMyHkRHAwpihcgQIwMCREcDCmKFnAQHMicCQwMKZoWQEAMyKwJTMisyIzIvMhMDCmaFsrGlzVHlwZWRBcnJheZLMisySwMDAzIiQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNUeXBlZEFycmF5LmpzmKFyAAzAzIuRzInAwpihZwMAzIzAlMyMzI3MjsyPwMKYoXIAEMDMjZHMhMDCmKFyAwnAzI6RDcDCmKFyARDAzI+RzITAwpihcgQQwMCRfMDCmKFnAQPMkcCQwMKYoWcJC8ySwJHMksDCmKFyAAzAwJHMicDC
====catalogjs annotation end====*/