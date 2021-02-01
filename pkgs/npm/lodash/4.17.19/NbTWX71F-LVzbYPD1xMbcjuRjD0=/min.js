import { default as baseExtremum } from "./dist/28.js";
import { default as baseLt } from "./dist/166.js";
import { default as identity } from "./identity.js";
function min(array) {
  return array && array.length ? baseExtremum(array, identity, baseLt) : undefined;
}
export { min as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMjguanMDwsCVwq0uL2Rpc3QvMTY2LmpzBsLAlcKtLi9pZGVudGl0eS5qcwnCwIGnZGVmYXVsdJShbKNtaW4RwNwAE5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFprGJhc2VFeHRyZW11bZICDcAAp2RlZmF1bHTAwJihcgsMwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaZiYXNlTHSSBQ/AAadkZWZhdWx0wMCYoXILBsDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmoaWRlbnRpdHmSCA7AAqdkZWZhdWx0wMCYoXILCMDAkQfAwpyhaQEYBwqQwMICwsDAl6FvAQALEJDAmaFkABAMwJQNDg8MwMKYoWyjbWlukgwSwMDAwNlDV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL21pbi5qc5ihcgkDwA2RC8DCmKFyKwzADpEBwMKYoXIICMAPkQfAwpihcgIGwMCRBMDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAPAwJELwMI=
====catalogjs annotation end====*/