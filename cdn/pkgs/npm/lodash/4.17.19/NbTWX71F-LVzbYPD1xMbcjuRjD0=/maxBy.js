import { default as baseExtremum } from "./dist/28.js";
import { default as baseGt } from "./dist/165.js";
import { default as baseIteratee } from "./dist/6.js";
function maxBy(array, iteratee) {
  return array && array.length ? baseExtremum(array, baseIteratee(iteratee, 2), baseGt) : undefined;
}
export { maxBy as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMjguanMDwsCVwq0uL2Rpc3QvMTY1LmpzBsLAlcKrLi9kaXN0LzYuanMJwsCBp2RlZmF1bHSVoWylbWF4QnkRwMDcABOXoW8AAAPAkMCZoWQJAALAkQLAwpmhaaxiYXNlRXh0cmVtdW2SAg3AAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFppmJhc2VHdJIFD8ABp2RlZmF1bHTAwMCYoXILBsDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmsYmFzZUl0ZXJhdGVlkggOwAKnZGVmYXVsdMDAwJihcgsMwMCRB8DCnKFpARYHCpDAwgLCwMCXoW8BAAsQkMCZoWQAEAzAlA0ODwzAwpmhbKVtYXhCeZIMEsDAwMCQ2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbWF4QnkuanOYoXIJBcANkQvAwpihcjUMwA6RAcDCmKFyCAzAD5EHwMKYoXIPBsDAkQTAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAFwMCRC8DC
====catalogjs annotation end====*/