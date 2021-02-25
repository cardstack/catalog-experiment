import { default as constant } from "../constant.js";
import { default as defineProperty } from "./57.js";
import { default as identity } from "../identity.js";
import { default as shortOut } from "./118.js";
var baseSetToString = !defineProperty ? identity : function (func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};
var setToString = shortOut(baseSetToString);
export { setToString as default };
/*====catalogjs annotation start====
k5SVwq4uLi9jb25zdGFudC5qcwPCwJXCpy4vNTcuanMHwsCVwq4uLi9pZGVudGl0eS5qcwvCwJXCqC4vMTE4LmpzD8LAgadkZWZhdWx0laFsq3NldFRvU3RyaW5nIcDA3AAjl6FvAAADwJEbwJmhZAkAAgSRAsDCmaFpqGNvbnN0YW50kgIYwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCBDAwJDAwpmhZAkABgiRBsDCmaFprmRlZmluZVByb3BlcnR5kwYVF8ABp2RlZmF1bHTAwMCYoXILDsDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgJwMCQwMKZoWQJAAoMkQrAwpmhaahpZGVudGl0eZIKFsACp2RlZmF1bHTAwMCYoXILCMDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgQwMCQwMKZoWQJAA4QkQ7AwpmhaahzaG9ydE91dJIOHsADp2RlZmF1bHTAwMCYoXILCMDAkQ3AwpyhaQEBDRGREMDCA8LAwJihZwgKwMCQwMKXoW8BABIZkMCYoWcAARPAkMDCmaFkBCYUwJYVFhcYFBLAwpmhbK9iYXNlU2V0VG9TdHJpbmeSFB/AwMASkNlQV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlU2V0VG9TdHJpbmcuanOYoXIAD8AVkRPAwpihcgQOwBaRBcDCmKFyAwjAF5EJwMKYoXImDsAYkQXAwpihclUIwMCRAcDCl6FvAQAaIJDAmKFnAAEbwJDAwpmhZAQAHMCTHBodwMKZoWyrc2V0VG9TdHJpbmeSHCLAwMAakNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19zZXRUb1N0cmluZy5qc5ihcgALwB2RG8DCmKFnAwEewJIeH8DCmKFyAAjAH5ENwMKYoXIBD8DAkRPAwpihZwEDIcCQwMKYoWcJCyLAkSLAwpihcgALwMCRG8DC
====catalogjs annotation end====*/