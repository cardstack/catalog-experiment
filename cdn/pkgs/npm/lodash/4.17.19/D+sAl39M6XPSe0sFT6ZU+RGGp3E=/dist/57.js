import { default as getNative } from "./68.js";
var defineProperty = function () {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}();
export { defineProperty as default };
/*====catalogjs annotation start====
k5GVwqcuLzY4LmpzA8LAgadkZWZhdWx0laFsrmRlZmluZVByb3BlcnR5DMDAnpehbwAAA8CRB8CZoWQJAAIEkQLAwpmhaalnZXROYXRpdmWSAgrAAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcICcDAkMDCl6FvAQAGC5DAmKFnAAEHwJDAwpmhZAQACMCTCAYJwMKZoWyuZGVmaW5lUHJvcGVydHmSCA3AwMAGkNlPV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19kZWZpbmVQcm9wZXJ0eS5qc5ihcgAOwAmRB8DCmKFnA1cKwJEKwMKYoXIlCcDAkQHAwpihZwEDDMCQwMKYoWcJCw3AkQ3AwpihcgAOwMCRB8DC
====catalogjs annotation end====*/