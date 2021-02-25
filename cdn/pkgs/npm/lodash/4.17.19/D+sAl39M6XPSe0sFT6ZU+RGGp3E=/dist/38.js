import { default as metaMap } from "./39.js";
import { default as noop } from "../noop.js";
var getData = !metaMap ? noop : function (func) {
  return metaMap.get(func);
};
export { getData as default };
/*====catalogjs annotation start====
k5KVwqcuLzM5LmpzA8LAlcKqLi4vbm9vcC5qcwfCwIGnZGVmYXVsdJWhbKdnZXREYXRhEcDA3AATl6FvAAADwJDAmaFkCQACBJECwMKZoWmnbWV0YU1hcJMCDQ/AAKdkZWZhdWx0wMDAmKFyCwfAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcICcDAkMDCmaFkCQAGCJEGwMKZoWmkbm9vcJIGDsABp2RlZmF1bHTAwMCYoXILBMDAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgMwMCQwMKXoW8BAAoQkMCYoWcAAQvAkMDCmaFkBA0MwJUNDg8MCsDCmaFsp2dldERhdGGSDBLAwMAKkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19nZXREYXRhLmpzmKFyAAfADZELwMKYoXIEB8AOkQHAwpihcgMEwA+RBcDCmKFyHgfAwJEBwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIAB8DAkQvAwg==
====catalogjs annotation end====*/