import { default as isArray } from "../isArray.js";
import { default as isSymbol } from "../isSymbol.js";
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }

  var type = typeof value;

  if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol(value)) {
    return true;
  }

  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
export { isKey as default };
/*====catalogjs annotation start====
k5KVwq0uLi9pc0FycmF5LmpzA8LAlcKuLi4vaXNTeW1ib2wuanMGwsCBp2RlZmF1bHSVoWylaXNLZXkUwMDcABaXoW8AAAPAkMCZoWQJAALAkQLAwpmhaadpc0FycmF5kgIPwACnZGVmYXVsdMDAwJihcgsHwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaahpc1N5bWJvbJIFEMABp2RlZmF1bHTAwMCYoXILCMDAkQTAwpyhaQEZBAeQwMIBwsDAl6FvAQAIE5DAmKFnAAEJDZDAwpmhZAQ1CguSCgjAwpmhbKxyZUlzRGVlcFByb3CSChLAwMAIkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19pc0tleS5qc5ihcgAMwMCRCcDCmaFkBgoMwJIMCMDCmaFsrXJlSXNQbGFpblByb3CSDBHAwMAIkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19pc0tleS5qc5ihcgANwMCRC8DCmaFkATwOwJcPEBESDgsJwMKZoWylaXNLZXmSDhXAwMDAkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19pc0tleS5qc5ihcgkFwA+RDcDCmKFyGAfAEJEBwMKYoXLMkgjAEZEEwMKYoXIqDcASkQvAwpihchEMwMCRCcDCmKFnAQMUwJDAwpihZwkLFcCRFcDCmKFyAAXAwJENwMI=
====catalogjs annotation end====*/