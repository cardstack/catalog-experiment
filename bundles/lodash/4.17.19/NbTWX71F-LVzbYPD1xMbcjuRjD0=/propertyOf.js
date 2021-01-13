import { default as baseGet } from "./dist/14.js";
function propertyOf(object) {
  return function (path) {
    return object == null ? undefined : baseGet(object, path);
  };
}
export { propertyOf as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTQuanMDwsCBp2RlZmF1bHSUoWyqcHJvcGVydHlPZgnAm5ehbwAAA8CRBcCZoWQJAALAkQLAwpihaadiYXNlR2V0kgIHwACnZGVmYXVsdMDAmKFyCwfAwJEBwMKcoWkAFwEEkMDCAMLAwJehbwEABQiQwJmhZAAWBsCSBwbAwpihbKpwcm9wZXJ0eU9mkgYKwMDAwNlKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3Byb3BlcnR5T2YuanOYoXIJCsAHkQXAwpihck4HwMCRAcDCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyAArAwJEFwMI=
====catalogjs annotation end====*/