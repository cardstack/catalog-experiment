import { default as isObjectLike } from "./isObjectLike.js";
import { default as isPlainObject } from "./isPlainObject.js";
function isElement(value) {
  return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
}
export { isElement as default };
/*====catalogjs annotation start====
k5KVwrEuL2lzT2JqZWN0TGlrZS5qcwPCwJXCsi4vaXNQbGFpbk9iamVjdC5qcwbCwIGnZGVmYXVsdJWhbKlpc0VsZW1lbnQNwMCfl6FvAAADwJDAmaFkCQACwJECwMKZoWmsaXNPYmplY3RMaWtlkgIKwACnZGVmYXVsdMDAwJihcgsMwMCRAcDCnKFpABwBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaa1pc1BsYWluT2JqZWN0kgULwAGnZGVmYXVsdMDAwJihcgsNwMCRBMDCnKFpAR0EB5DAwgHCwMCXoW8BAAgMkMCZoWQACgnAkwoLCcDCmaFsqWlzRWxlbWVudJIJDsDAwMCQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNFbGVtZW50LmpzmKFyCQnACpEIwMKYoXITDMALkQHAwpihciQNwMCRBMDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAnAwJEIwMI=
====catalogjs annotation end====*/