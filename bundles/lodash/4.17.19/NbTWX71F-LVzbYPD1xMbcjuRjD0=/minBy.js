import { default as baseExtremum } from "./dist/28.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseLt } from "./dist/166.js";
function minBy(array, iteratee) {
  return array && array.length ? baseExtremum(array, baseIteratee(iteratee, 2), baseLt) : undefined;
}
export { minBy as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMjguanMDwsCVwqsuL2Rpc3QvNi5qcwbCwJXCrS4vZGlzdC8xNjYuanMJwsCBp2RlZmF1bHSUoWylbWluQnkRwNwAE5ehbwAAA8CRC8CZoWQJAALAkQLAwpihaaxiYXNlRXh0cmVtdW2SAg3AAKdkZWZhdWx0wMCYoXILDMDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmsYmFzZUl0ZXJhdGVlkgUOwAGnZGVmYXVsdMDAmKFyCwzAwJEEwMKcoWkBFgQJkMDCAcLAwJmhZAkACMCRCMDCmKFppmJhc2VMdJIID8ACp2RlZmF1bHTAwJihcgsGwMCRB8DCnKFpARgHCpDAwgLCwMCXoW8BAAsQkMCZoWQAEAzAlA0ODwzAwpihbKVtaW5CeZIMEsDAwMDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9taW5CeS5qc5ihcgkFwA2RC8DCmKFyNQzADpEBwMKYoXIIDMAPkQTAwpihcg8GwMCRB8DCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAXAwJELwMI=
====catalogjs annotation end====*/