import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
import { default as baseUnary } from "./dist/135.js";
import { default as nodeUtil } from "./dist/94.js";
var arrayBufferTag = '[object ArrayBuffer]';
function baseIsArrayBuffer(value) {
  return isObjectLike(value) && baseGetTag(value) == arrayBufferTag;
}
var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer;
var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
export { isArrayBuffer as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvODYuanMDwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwbCwJXCrS4vZGlzdC8xMzUuanMJwsCVwqwuL2Rpc3QvOTQuanMMwsCBp2RlZmF1bHSVoWytaXNBcnJheUJ1ZmZlciXAwNwAJ5ehbwAAA8CRHcCZoWQJAALAkQLAwpmhaapiYXNlR2V0VGFnkgIUwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaxpc09iamVjdExpa2WSBRPAAadkZWZhdWx0wMDAmKFyCwzAwJEEwMKcoWkBHAQJkMDCAcLAwJmhZAkACMCRCMDCmaFpqWJhc2VVbmFyeZIIIcACp2RlZmF1bHTAwMCYoXILCcDAkQfAwpyhaQEYBwyQwMICwsDAmaFkCQALwJELwMKZoWmobm9kZVV0aWyTCxobwAOnZGVmYXVsdMDAwJihcgsIwMCRCsDCnKFpARcKDZDAwgPCwMCXoW8BAA4WkMCYoWcAAQ8RkMDCmaFkBBkQwJIQDsDCmaFsrmFycmF5QnVmZmVyVGFnkhAVwMDADpDZUlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzQXJyYXlCdWZmZXIuanOYoXIADsDAkQ/AwpmhZAEDEsCVExQVEg/AwpmhbLFiYXNlSXNBcnJheUJ1ZmZlcpISI8DAwMCQ2VJXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJc0FycmF5QnVmZmVyLmpzmKFyCRHAE5ERwMKYoXITDMAUkQTAwpihcgsKwBWRAcDCmKFyCw7AwJEPwMKXoW8BABckkMCYoWcAARgckMDCmaFkBA4ZwJQaGxkXwMKZoWyxbm9kZUlzQXJyYXlCdWZmZXKTGSAiwMDAF5DZTVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0FycmF5QnVmZmVyLmpzmKFyABHAGpEYwMKYoXIDCMAbkQrAwpihcgQIwMCRCsDCmKFnAQEdwJDAwpmhZAQAHsCUHhwfGMDCmaFsrWlzQXJyYXlCdWZmZXKSHibAwMAckNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzQXJyYXlCdWZmZXIuanOYoXIADcAfkR3AwpihZwMAIMCUICEiI8DCmKFyABHAIZEYwMKYoXIDCcAikQfAwpihcgERwCORGMDCmKFyBBHAwJERwMKYoWcBAyXAkMDCmKFnCQsmwJEmwMKYoXIADcDAkR3Awg==
====catalogjs annotation end====*/