import { default as copyObject } from "./dist/54.js";
import { default as keysIn } from "./keysIn.js";
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}
export { toPlainObject as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNTQuanMDwsCVwqsuL2tleXNJbi5qcwbCwIGnZGVmYXVsdJShbK10b1BsYWluT2JqZWN0DcCfl6FvAAADwJDAmaFkCQACwJECwMKYoWmqY29weU9iamVjdJICCsAAp2RlZmF1bHTAwJihcgsKwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaZrZXlzSW6SBQvAAadkZWZhdWx0wMCYoXILBsDAkQTAwpyhaQEWBAeQwMIBwsDAl6FvAQAIDJDAmaFkAAsJwJMKCwnAwpihbK10b1BsYWluT2JqZWN0kgkOwMDAwNlNV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RvUGxhaW5PYmplY3QuanOYoXIJDcAKkQjAwpihchMKwAuRAcDCmKFyCAbAwJEEwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIADcDAkQjAwg==
====catalogjs annotation end====*/