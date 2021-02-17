import { default as baseGetTag } from "./dist/86.js";
import { default as isObjectLike } from "./isObjectLike.js";
var argsTag = '[object Arguments]';
function baseIsArguments(value) {
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}
var objectProto = Object.prototype;
var hasOwnProperty0 = objectProto.hasOwnProperty;
var propertyIsEnumerable0 = objectProto.propertyIsEnumerable;
var isArguments = baseIsArguments(function () {
  return arguments;
}()) ? baseIsArguments : function (value) {
  return isObjectLike(value) && hasOwnProperty0.call(value, 'callee') && !propertyIsEnumerable0.call(value, 'callee');
};
export { isArguments as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODYuanMDwsCVwrEuL2lzT2JqZWN0TGlrZS5qcwbCwIGnZGVmYXVsdJWhbKtpc0FyZ3VtZW50cybAwNwAKJehbwAAA8CRHcCZoWQJAALAkQLAwpmhaapiYXNlR2V0VGFnkgIOwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaxpc09iamVjdExpa2WTBQ0iwAGnZGVmYXVsdMDAwJihcgsMwMCRBMDCnKFpARwEB5DAwgHCwMCXoW8BAAgQkMCYoWcAAQkLkMDCmaFkBBcKwJIKCMDCmaFsp2FyZ3NUYWeSCg/AwMAIkNlQV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSXNBcmd1bWVudHMuanOYoXIAB8DAkQnAwpmhZAEDDMCVDQ4PDAnAwpmhbK9iYXNlSXNBcmd1bWVudHOTDCAhwMDAwJDZUFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUlzQXJndW1lbnRzLmpzmKFyCQ/ADZELwMKYoXITDMAOkQTAwpihcgsKwA+RAcDCmKFyCwfAwJEJwMKXoW8BABElkMCYoWcAARIUkMDCmaFkBBMTwJITEcDCmaFsq29iamVjdFByb3RvkxMXG8DAwBGQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNBcmd1bWVudHMuanOYoXIAC8DAkRLAwpihZwEBFRiQwMKZoWQEDxbAlBcWFBLAwpmhbK9oYXNPd25Qcm9wZXJ0eTCSFiPAwMAUkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzQXJndW1lbnRzLmpzmKFyAA/AF5EVwMKYoXIDC8DAkRLAwpihZwEBGRyQwMKZoWQEFRrAlBsaGBLAwpmhbLVwcm9wZXJ0eUlzRW51bWVyYWJsZTCSGiTAwMAYkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzQXJndW1lbnRzLmpzmKFyABXAG5EZwMKYoXIDC8DAkRLAwpihZwEBHcCQwMKZoWQEAB7AlR4cHxUZwMKZoWyraXNBcmd1bWVudHOSHifAwMAckNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzQXJndW1lbnRzLmpzmKFyAAvAH5EdwMKYoWcDGSDAlSAhIiMkwMKYoXIAD8AhkQvAwpihcioPwCKRC8DCmKFyHwzAI5EEwMKYoXILD8AkkRXAwpihchsVwMCRGcDCmKFnAQMmwJDAwpihZwkLJ8CRJ8DCmKFyAAvAwJEdwMI=
====catalogjs annotation end====*/