import { default as baseSet } from "./dist/16.js";
function setWith(object, path, value, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return object == null ? object : baseSet(object, path, value, customizer);
}
export { setWith as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTYuanMDwsCBp2RlZmF1bHSUoWync2V0V2l0aAnAm5ehbwAAA8CRBcCZoWQJAALAkQLAwpihaadiYXNlU2V0kgIHwACnZGVmYXVsdMDAmKFyCwfAwJEBwMKcoWkAFwEEkMDCAMLAwJehbwEABQiQwJmhZAAkBsCSBwbAwpihbKdzZXRXaXRokgYKwMDAwNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3NldFdpdGguanOYoXIJB8AHkQXAwpihcsyQB8DAkQHAwpihZwEDCcCQwMKYoWcJCwrAkQrAwpihcgAHwMCRBcDC
====catalogjs annotation end====*/