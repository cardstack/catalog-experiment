import { default as baseIteratee } from "./dist/6.js";
import { default as negate } from "./negate.js";
import { default as pickBy } from "./pickBy.js";
function omitBy(object, predicate) {
  return pickBy(object, negate(baseIteratee(predicate)));
}
export { omitBy as default };
/*====catalogjs annotation start====
k5OVwqsuL2Rpc3QvNi5qcwPCwJXCqy4vbmVnYXRlLmpzBsLAlcKrLi9waWNrQnkuanMJwsCBp2RlZmF1bHSUoWymb21pdEJ5EcDcABOXoW8AAAPAkMCZoWQJAALAkQLAwpihaaxiYXNlSXRlcmF0ZWWSAg/AAKdkZWZhdWx0wMCYoXILDMDAkQHAwpyhaQAWAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmmbmVnYXRlkgUOwAGnZGVmYXVsdMDAmKFyCwbAwJEEwMKcoWkBFgQJkMDCAcLAwJmhZAkACMCRCMDCmKFppnBpY2tCeZIIDcACp2RlZmF1bHTAwJihcgsGwMCRB8DCnKFpARYHCpDAwgLCwMCXoW8BAAsQkMCZoWQAEAzAlA0ODwzAwpihbKZvbWl0QnmSDBLAwMDA2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvb21pdEJ5LmpzmKFyCQbADZELwMKYoXIfBsAOkQfAwpihcgkGwA+RBMDCmKFyAQzAwJEBwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIABsDAkQvAwg==
====catalogjs annotation end====*/