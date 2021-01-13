import { default as isObjectLike } from "./isObjectLike.js";
import { default as isPlainObject } from "./isPlainObject.js";
function isElement(value) {
  return isObjectLike(value) && value.nodeType === 1 && !isPlainObject(value);
}
export { isElement as default };
/*====catalogjs annotation start====
k5KVwrEuL2lzT2JqZWN0TGlrZS5qcwPCwJXCsi4vaXNQbGFpbk9iamVjdC5qcwbCwIGnZGVmYXVsdJShbKlpc0VsZW1lbnQNwJ+XoW8AAAPAkQjAmaFkCQACwJECwMKYoWmsaXNPYmplY3RMaWtlkgIKwACnZGVmYXVsdMDAmKFyCwzAwJEBwMKcoWkAHAEGkMDCAMLAwJmhZAkABcCRBcDCmKFprWlzUGxhaW5PYmplY3SSBQvAAadkZWZhdWx0wMCYoXILDcDAkQTAwpyhaQEdBAeQwMIBwsDAl6FvAQAIDJDAmaFkAAoJwJMKCwnAwpihbKlpc0VsZW1lbnSSCQ7AwMDA2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNFbGVtZW50LmpzmKFyCQnACpEIwMKYoXITDMALkQHAwpihciQNwMCRBMDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAnAwJEIwMI=
====catalogjs annotation end====*/