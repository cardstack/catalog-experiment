import { default as capitalize } from "./capitalize.js";
import { default as createCompounder } from "./dist/19.js";
var camelCase = createCompounder(function (result, word, index) {
  word = word.toLowerCase();
  return result + (index ? capitalize(word) : word);
});
export { camelCase as default };
/*====catalogjs annotation start====
k5KVwq8uL2NhcGl0YWxpemUuanMDwsCVwqwuL2Rpc3QvMTkuanMHwsCBp2RlZmF1bHSVoWypY2FtZWxDYXNlEcDA3AATl6FvAAADwJELwJmhZAkAAgSRAsDCmaFpqmNhcGl0YWxpemWSAg/AAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIEcDAkMDCmaFkCQAGCJEGwMKZoWmwY3JlYXRlQ29tcG91bmRlcpIGDsABp2RlZmF1bHTAwMCYoXILEMDAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgOwMCQwMKXoW8BAAoQkMCYoWcAAQvAkMDCmaFkBAAMwJMMCg3AwpmhbKljYW1lbENhc2WSDBLAwMAKkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2NhbWVsQ2FzZS5qc5ihcgAJwA2RC8DCmKFnAxIOwJIOD8DCmKFyABDAD5EFwMKYoXJaCsDAkQHAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAJwMCRC8DC
====catalogjs annotation end====*/