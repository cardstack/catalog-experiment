import { default as baseAssignValue } from "./dist/56.js";
import { default as createAggregator } from "./dist/2.js";
var keyBy = createAggregator(function (result, value, key) {
  baseAssignValue(result, key, value);
});
export { keyBy as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNTYuanMDwsCVwqsuL2Rpc3QvMi5qcwbCwIGnZGVmYXVsdJShbKVrZXlCeQ/A3AARl6FvAAADwJEJwJmhZAkAAsCRAsDCmKFpr2Jhc2VBc3NpZ25WYWx1ZZICDcAAp2RlZmF1bHTAwJihcgsPwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihabBjcmVhdGVBZ2dyZWdhdG9ykgUMwAGnZGVmYXVsdMDAmKFyCxDAwJEEwMKcoWkBFgQHkMDCAcLAwJehbwEACA6QwJihZwABCcCQwMKZoWQEAArAkwoIC8DCmKFspWtleUJ5kgoQwMDACNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2tleUJ5LmpzmKFyAAXAC5EJwMKYoWcDGAzAkgwNwMKYoXIAEMANkQTAwpihciMPwMCRAcDCmKFnAQMPwJDAwpihZwkLEMCREMDCmKFyAAXAwJEJwMI=
====catalogjs annotation end====*/