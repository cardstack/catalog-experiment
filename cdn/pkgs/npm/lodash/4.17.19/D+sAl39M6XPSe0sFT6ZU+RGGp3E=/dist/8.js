import { default as apply } from "./111.js";
import { default as castPath } from "./17.js";
import { default as last } from "../last.js";
import { default as parent0 } from "./11.js";
import { default as toKey } from "./27.js";
function baseInvoke(object, path, args) {
  path = castPath(path, object);
  object = parent0(object, path);
  var func = object == null ? object : object[toKey(last(path))];
  return func == null ? undefined : apply(func, object, args);
}
export { baseInvoke as default };
/*====catalogjs annotation start====
k5WVwqguLzExMS5qcwPCwJXCpy4vMTcuanMHwsCVwqouLi9sYXN0LmpzC8LAlcKnLi8xMS5qcw/CwJXCpy4vMjcuanMTwsCBp2RlZmF1bHSVoWyqYmFzZUludm9rZR7AwNwAIJehbwAAA8CQwJmhZAkAAgSRAsDCmaFppWFwcGx5kgIcwACnZGVmYXVsdMDAwJihcgsFwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCArAwJDAwpmhZAkABgiRBsDCmaFpqGNhc3RQYXRokgYYwAGnZGVmYXVsdMDAwJihcgsIwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCAnAwJDAwpmhZAkACgyRCsDCmaFppGxhc3SSChvAAqdkZWZhdWx0wMDAmKFyCwTAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIDMDAkMDCmaFkCQAOEJEOwMKZoWmncGFyZW50MJIOGcADp2RlZmF1bHTAwMCYoXILB8DAkQ3AwpyhaQEBDROREMDCA8LAwJihZwgJwMCQwMKZoWQJABIUkRLAwpmhaaV0b0tleZISGsAEp2RlZmF1bHTAwMCYoXILBcDAkRHAwpyhaQEBERWRFMDCBMLAwJihZwgJwMCQwMKXoW8BABYdkMCZoWQAFxfAlhgZGhscF8DCmaFsqmJhc2VJbnZva2WSFx/AwMDAkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlSW52b2tlLmpzmKFyCQrAGJEWwMKYoXIgCMAZkQXAwpihchsHwBqRDcDCmKFyPgXAG5ERwMKYoXIBBMAckQnAwpihci4FwMCRAcDCmKFnAQMewJDAwpihZwkLH8CRH8DCmKFyAArAwJEWwMI=
====catalogjs annotation end====*/