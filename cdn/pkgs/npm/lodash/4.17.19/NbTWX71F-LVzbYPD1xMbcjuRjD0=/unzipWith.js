import { default as apply } from "./dist/111.js";
import { default as arrayMap } from "./dist/98.js";
import { default as unzip } from "./unzip.js";
function unzipWith(array, iteratee) {
  if (!(array && array.length)) {
    return [];
  }

  var result = unzip(array);

  if (iteratee == null) {
    return result;
  }

  return arrayMap(result, function (group) {
    return apply(iteratee, undefined, group);
  });
}
export { unzipWith as default };
/*====catalogjs annotation start====
k5OVwq0uL2Rpc3QvMTExLmpzA8LAlcKsLi9kaXN0Lzk4LmpzBsLAlcKqLi91bnppcC5qcwnCwIGnZGVmYXVsdJWhbKl1bnppcFdpdGgRwMDcABOXoW8AAAPAkMCZoWQJAALAkQLAwpmhaaVhcHBseZICD8AAp2RlZmF1bHTAwMCYoXILBcDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmoYXJyYXlNYXCSBQ7AAadkZWZhdWx0wMDAmKFyCwjAwJEEwMKcoWkBFwQJkMDCAcLAwJmhZAkACMCRCMDCmaFppXVuemlwkggNwAKnZGVmYXVsdMDAwJihcgsFwMCRB8DCnKFpARUHCpDAwgLCwMCXoW8BAAsQkMCZoWQAJQzAlA0ODwzAwpmhbKl1bnppcFdpdGiSDBLAwMDAkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3VuemlwV2l0aC5qc5ihcgkJwA2RC8DCmKFyWQXADpEHwMKYoXJFCMAPkQTAwpihcicFwMCRAcDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAnAwJELwMI=
====catalogjs annotation end====*/