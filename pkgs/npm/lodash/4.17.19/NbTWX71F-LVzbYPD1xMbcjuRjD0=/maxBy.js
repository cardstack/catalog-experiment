import { default as baseExtremum } from "./dist/28.js";
import { default as baseGt } from "./dist/165.js";
import { default as baseIteratee } from "./dist/6.js";
function maxBy(array, iteratee) {
  return array && array.length ? baseExtremum(array, baseIteratee(iteratee, 2), baseGt) : undefined;
}
export { maxBy as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMjguanMDwsCVwq0uL2Rpc3QvMTY1LmpzBsLAlcKrLi9kaXN0LzYuanMJwsCBp2RlZmF1bHSUoWylbWF4QnkRwNwAE5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFprGJhc2VFeHRyZW11bZICDcAAp2RlZmF1bHTAwJihcgsMwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaZiYXNlR3SSBQ/AAadkZWZhdWx0wMCYoXILBsDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmsYmFzZUl0ZXJhdGVlkggOwAKnZGVmYXVsdMDAmKFyCwzAwJEHwMKcoWkBFgcKkMDCAsLAwJehbwEACxCQwJmhZAAQDMCUDQ4PDMDCmKFspW1heEJ5kgwSwMDAwNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL21heEJ5LmpzmKFyCQXADZELwMKYoXI1DMAOkQHAwpihcggMwA+RB8DCmKFyDwbAwJEEwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIABcDAkQvAwg==
====catalogjs annotation end====*/