import { default as baseIndexOf } from "./123.js";
function charsStartIndex(strSymbols, chrSymbols) {
  var index = -1,
      length = strSymbols.length;

  while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}

  return index;
}
export { charsStartIndex as default };
/*====catalogjs annotation start====
k5GVwqguLzEyMy5qcwPCwIGnZGVmYXVsdJWhbK9jaGFyc1N0YXJ0SW5kZXgJwMCbl6FvAAADwJDAmaFkCQACwJECwMKZoWmrYmFzZUluZGV4T2aSAgfAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAEwEEkMDCAMLAwJehbwEABQiQwJmhZAA+BsCSBwbAwpmhbK9jaGFyc1N0YXJ0SW5kZXiSBgrAwMDAkNlQV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jaGFyc1N0YXJ0SW5kZXguanOYoXIJD8AHkQXAwpihcm0LwMCRAcDCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyAA/AwJEFwMI=
====catalogjs annotation end====*/