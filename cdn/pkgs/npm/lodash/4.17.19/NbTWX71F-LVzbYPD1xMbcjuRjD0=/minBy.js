import { default as baseExtremum } from "./dist/28.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseLt } from "./dist/166.js";
function minBy(array, iteratee) {
  return array && array.length ? baseExtremum(array, baseIteratee(iteratee, 2), baseLt) : undefined;
}
export { minBy as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMjguanMDwsCVwqsuL2Rpc3QvNi5qcwbCwJXCrS4vZGlzdC8xNjYuanMJwsCBp2RlZmF1bHSVoWylbWluQnkRwMDcABOXoW8AAAPAkMCZoWQJAALAkQLAwpmhaaxiYXNlRXh0cmVtdW2SAg3AAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFprGJhc2VJdGVyYXRlZZIFDsABp2RlZmF1bHTAwMCYoXILDMDAkQTAwpyhaQEWBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmmYmFzZUx0kggPwAKnZGVmYXVsdMDAwJihcgsGwMCRB8DCnKFpARgHCpDAwgLCwMCXoW8BAAsQkMCZoWQAEAzAlA0ODwzAwpmhbKVtaW5CeZIMEsDAwMCQ2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbWluQnkuanOYoXIJBcANkQvAwpihcjUMwA6RAcDCmKFyCAzAD5EEwMKYoXIPBsDAkQfAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAFwMCRC8DC
====catalogjs annotation end====*/