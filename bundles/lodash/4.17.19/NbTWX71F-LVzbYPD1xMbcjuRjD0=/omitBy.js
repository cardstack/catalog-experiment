import { default as baseIteratee } from "./dist/6.js";
import { default as negate } from "./negate.js";
import { default as pickBy } from "./pickBy.js";
function omitBy(object, predicate) {
  return pickBy(object, negate(baseIteratee(predicate)));
}
export { omitBy as default };
/*====catalogjs annotation start====
k5OVwqsuL2Rpc3QvNi5qcwPCwJXCqy4vbmVnYXRlLmpzBsLAlcKrLi9waWNrQnkuanMJwsCBp2RlZmF1bHSUoWymb21pdEJ5EcDcABOXoW8AAAPAkQvAmaFkCQACwJECwMKYoWmsYmFzZUl0ZXJhdGVlkgIPwACnZGVmYXVsdMDAmKFyCwzAwJEBwMKcoWkAFgEGkMDCAMLAwJmhZAkABcCRBcDCmKFppm5lZ2F0ZZIFDsABp2RlZmF1bHTAwJihcgsGwMCRBMDCnKFpARYECZDAwgHCwMCZoWQJAAjAkQjAwpihaaZwaWNrQnmSCA3AAqdkZWZhdWx0wMCYoXILBsDAkQfAwpyhaQEWBwqQwMICwsDAl6FvAQALEJDAmaFkABAMwJQNDg8MwMKYoWymb21pdEJ5kgwSwMDAwNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL29taXRCeS5qc5ihcgkGwA2RC8DCmKFyHwbADpEHwMKYoXIJBsAPkQTAwpihcgEMwMCRAcDCmKFnAQMRwJDAwpihZwkLEsCREsDCmKFyAAbAwJELwMI=
====catalogjs annotation end====*/