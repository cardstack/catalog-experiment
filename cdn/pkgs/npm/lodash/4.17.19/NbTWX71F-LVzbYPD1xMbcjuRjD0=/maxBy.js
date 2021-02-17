import { default as baseExtremum } from "./dist/28.js";
import { default as baseGt } from "./dist/165.js";
import { default as baseIteratee } from "./dist/6.js";
function maxBy(array, iteratee) {
  return array && array.length ? baseExtremum(array, baseIteratee(iteratee, 2), baseGt) : undefined;
}
export { maxBy as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMjguanMDwsCVwq0uL2Rpc3QvMTY1LmpzB8LAlcKrLi9kaXN0LzYuanMLwsCBp2RlZmF1bHSVoWylbWF4QnkUwMDcABaXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaaxiYXNlRXh0cmVtdW2SAhDAAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmmYmFzZUd0kgYSwAGnZGVmYXVsdMDAwJihcgsGwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA/AwJDAwpmhZAkACgyRCsDCmaFprGJhc2VJdGVyYXRlZZIKEcACp2RlZmF1bHTAwMCYoXILDMDAkQnAwpyhaQEBCQ2RDMDCAsLAwJihZwgNwMCQwMKXoW8BAA4TkMCZoWQAEA/AlBAREg/AwpmhbKVtYXhCeZIPFcDAwMCQ2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbWF4QnkuanOYoXIJBcAQkQ7AwpihcjUMwBGRAcDCmKFyCAzAEpEJwMKYoXIPBsDAkQXAwpihZwEDFMCQwMKYoWcJCxXAkRXAwpihcgAFwMCRDsDC
====catalogjs annotation end====*/