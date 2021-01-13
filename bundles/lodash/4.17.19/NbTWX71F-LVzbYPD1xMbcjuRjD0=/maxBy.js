import { default as baseExtremum } from "./dist/28.js";
import { default as baseGt } from "./dist/165.js";
import { default as baseIteratee } from "./dist/6.js";
function maxBy(array, iteratee) {
  return array && array.length ? baseExtremum(array, baseIteratee(iteratee, 2), baseGt) : undefined;
}
export { maxBy as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMjguanMDwsCVwq0uL2Rpc3QvMTY1LmpzBsLAlcKrLi9kaXN0LzYuanMJwsCBp2RlZmF1bHSUoWylbWF4QnkRwNwAE5ehbwAAA8CRC8CZoWQJAALAkQLAwpihaaxiYXNlRXh0cmVtdW2SAg3AAKdkZWZhdWx0wMCYoXILDMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmmYmFzZUd0kgUPwAGnZGVmYXVsdMDAmKFyCwbAwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFprGJhc2VJdGVyYXRlZZIIDsACp2RlZmF1bHTAwJihcgsMwMCRB8DCnKFpARYHCpDAwgLCwMCXoW8BAAsQkMCZoWQAEAzAlA0ODwzAwpihbKVtYXhCeZIMEsDAwMDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9tYXhCeS5qc5ihcgkFwA2RC8DCmKFyNQzADpEBwMKYoXIIDMAPkQfAwpihcg8GwMCRBMDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAXAwJELwMI=
====catalogjs annotation end====*/