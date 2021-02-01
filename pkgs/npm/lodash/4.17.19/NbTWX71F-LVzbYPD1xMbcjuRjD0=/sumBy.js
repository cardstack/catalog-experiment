import { default as baseIteratee } from "./dist/6.js";
import { default as baseSum } from "./dist/168.js";
function sumBy(array, iteratee) {
  return array && array.length ? baseSum(array, baseIteratee(iteratee, 2)) : 0;
}
export { sumBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrS4vZGlzdC8xNjguanMGwsCBp2RlZmF1bHSUoWylc3VtQnkNwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpihaaxiYXNlSXRlcmF0ZWWSAgvAAKdkZWZhdWx0wMCYoXILDMDAkQHAwpyhaQAWAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmnYmFzZVN1bZIFCsABp2RlZmF1bHTAwJihcgsHwMCRBMDCnKFpARgEB5DAwgHCwMCXoW8BAAgMkMCZoWQAFQnAkwoLCcDCmKFspXN1bUJ5kgkOwMDAwNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3N1bUJ5LmpzmKFyCQXACpEIwMKYoXI1B8ALkQTAwpihcggMwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAXAwJEIwMI=
====catalogjs annotation end====*/