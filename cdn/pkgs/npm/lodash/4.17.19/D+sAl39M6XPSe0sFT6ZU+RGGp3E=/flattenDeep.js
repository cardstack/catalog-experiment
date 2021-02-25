import { default as baseFlatten } from "./dist/85.js";
var INFINITY = 1 / 0;
function flattenDeep(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, INFINITY) : [];
}
export { flattenDeep as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvODUuanMDwsCBp2RlZmF1bHSVoWyrZmxhdHRlbkRlZXAOwMDcABCXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaatiYXNlRmxhdHRlbpICC8AAp2RlZmF1bHTAwMCYoXILC8DAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgOwMCQwMKXoW8BAAYNkMCYoWcAAQcJkMDCmaFkBAgIwJIIBsDCmaFsqElORklOSVRZkggMwMDABpDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9mbGF0dGVuRGVlcC5qc5ihcgAIwMCRB8DCmaFkAQkKwJQLDAoHwMKZoWyrZmxhdHRlbkRlZXCSCg/AwMDAkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2ZsYXR0ZW5EZWVwLmpzmKFyCQvAC5EJwMKYoXJNC8AMkQHAwpihcggIwMCRB8DCmKFnAQMOwJDAwpihZwkLD8CRD8DCmKFyAAvAwJEJwMI=
====catalogjs annotation end====*/