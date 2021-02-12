import { default as baseGetTag } from "./dist/86.js";
import { default as isObject } from "./isObject.js";
var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';
function isFunction(value) {
  if (!isObject(value)) {
    return false;
  }

  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
export { isFunction as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODYuanMDwsCVwq0uL2lzT2JqZWN0LmpzBsLAgadkZWZhdWx0laFsqmlzRnVuY3Rpb24awMDcAByXoW8AAAPAkMCZoWQJAALAkQLAwpmhaapiYXNlR2V0VGFnkgIUwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaahpc09iamVjdJIFE8ABp2RlZmF1bHTAwMCYoXILCMDAkQTAwpyhaQEYBAeQwMIBwsDAl6FvAQAIGZDAmKFnAAEJEZDAwpmhZAQbCguSCgjAwpmhbKhhc3luY1RhZ5IKF8DAwAiQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNGdW5jdGlvbi5qc5ihcgAIwMCRCcDCmaFkBhYMDZIMCMDCmaFsp2Z1bmNUYWeSDBXAwMAIkNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzRnVuY3Rpb24uanOYoXIAB8DAkQvAwpmhZAYfDg+SDgjAwpmhbKZnZW5UYWeSDhbAwMAIkNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzRnVuY3Rpb24uanOYoXIABsDAkQ3AwpmhZAYTEMCSEAjAwpmhbKhwcm94eVRhZ5IQGMDAwAiQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNGdW5jdGlvbi5qc5ihcgAIwMCRD8DCmaFkAQMSwJsTFBUWFxgSCw0JD8DCmaFsqmlzRnVuY3Rpb26SEhvAwMDAkNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzRnVuY3Rpb24uanOYoXIJCsATkRHAwpihchEIwBSRBMDCmKFyLgrAFZEBwMKYoXIZB8AWkQvAwpihcgsGwBeRDcDCmKFyCwjAGJEJwMKYoXILCMDAkQ/AwpihZwEDGsCQwMKYoWcJCxvAkRvAwpihcgAKwMCREcDC
====catalogjs annotation end====*/