import { default as baseExtremum } from "./dist/28.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseLt } from "./dist/166.js";
function minBy(array, iteratee) {
  return array && array.length ? baseExtremum(array, baseIteratee(iteratee, 2), baseLt) : undefined;
}
export { minBy as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMjguanMDwsCVwqsuL2Rpc3QvNi5qcwfCwJXCrS4vZGlzdC8xNjYuanMLwsCBp2RlZmF1bHSVoWylbWluQnkUwMDcABaXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaaxiYXNlRXh0cmVtdW2SAhDAAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmsYmFzZUl0ZXJhdGVlkgYRwAGnZGVmYXVsdMDAwJihcgsMwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA3AwJDAwpmhZAkACgyRCsDCmaFppmJhc2VMdJIKEsACp2RlZmF1bHTAwMCYoXILBsDAkQnAwpyhaQEBCQ2RDMDCAsLAwJihZwgPwMCQwMKXoW8BAA4TkMCZoWQAEA/AlBAREg/AwpmhbKVtaW5CeZIPFcDAwMCQ2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbWluQnkuanOYoXIJBcAQkQ7AwpihcjUMwBGRAcDCmKFyCAzAEpEFwMKYoXIPBsDAkQnAwpihZwEDFMCQwMKYoWcJCxXAkRXAwpihcgAFwMCRDsDC
====catalogjs annotation end====*/