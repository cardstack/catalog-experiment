import { default as baseClone } from "./dist/40.js";
import { default as baseIteratee } from "./dist/6.js";
var CLONE_DEEP_FLAG = 1;
function iteratee(func) {
  return baseIteratee(typeof func == 'function' ? func : baseClone(func, CLONE_DEEP_FLAG));
}
export { iteratee as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNDAuanMDwsCVwqsuL2Rpc3QvNi5qcwfCwIGnZGVmYXVsdJWhbKhpdGVyYXRlZRPAwNwAFZehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqWJhc2VDbG9uZZICEMAAp2RlZmF1bHTAwMCYoXILCcDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaaxiYXNlSXRlcmF0ZWWSBg/AAadkZWZhdWx0wMDAmKFyCwzAwJEFwMKcoWkBAQUJkQjAwgHCwMCYoWcIDcDAkMDCl6FvAQAKEpDAmKFnAAELDZDAwpmhZAQEDMCSDArAwpmhbK9DTE9ORV9ERUVQX0ZMQUeSDBHAwMAKkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2l0ZXJhdGVlLmpzmKFyAA/AwJELwMKZoWQBBQ7AlQ8QEQ4LwMKZoWyoaXRlcmF0ZWWSDhTAwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2l0ZXJhdGVlLmpzmKFyCQjAD5ENwMKYoXISDMAQkQXAwpihciQJwBGRAcDCmKFyBw/AwJELwMKYoWcBAxPAkMDCmKFnCQsUwJEUwMKYoXIACMDAkQ3Awg==
====catalogjs annotation end====*/