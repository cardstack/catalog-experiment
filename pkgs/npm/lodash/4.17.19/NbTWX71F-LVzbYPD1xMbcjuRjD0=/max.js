import { default as baseExtremum } from "./dist/28.js";
import { default as baseGt } from "./dist/165.js";
import { default as identity } from "./identity.js";
function max(array) {
  return array && array.length ? baseExtremum(array, identity, baseGt) : undefined;
}
export { max as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMjguanMDwsCVwq0uL2Rpc3QvMTY1LmpzBsLAlcKtLi9pZGVudGl0eS5qcwnCwIGnZGVmYXVsdJShbKNtYXgRwNwAE5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFprGJhc2VFeHRyZW11bZICDcAAp2RlZmF1bHTAwJihcgsMwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaZiYXNlR3SSBQ/AAadkZWZhdWx0wMCYoXILBsDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmoaWRlbnRpdHmSCA7AAqdkZWZhdWx0wMCYoXILCMDAkQfAwpyhaQEYBwqQwMICwsDAl6FvAQALEJDAmaFkABAMwJQNDg8MwMKYoWyjbWF4kgwSwMDAwNlDV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL21heC5qc5ihcgkDwA2RC8DCmKFyKwzADpEBwMKYoXIICMAPkQfAwpihcgIGwMCRBMDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAPAwJELwMI=
====catalogjs annotation end====*/