import { default as baseIteratee } from "./dist/6.js";
import { default as negate } from "./negate.js";
import { default as pickBy } from "./pickBy.js";
function omitBy(object, predicate) {
  return pickBy(object, negate(baseIteratee(predicate)));
}
export { omitBy as default };
/*====catalogjs annotation start====
k5OVwqsuL2Rpc3QvNi5qcwPCwJXCqy4vbmVnYXRlLmpzB8LAlcKrLi9waWNrQnkuanMLwsCBp2RlZmF1bHSVoWymb21pdEJ5FMDA3AAWl6FvAAADwJDAmaFkCQACBJECwMKZoWmsYmFzZUl0ZXJhdGVlkgISwACnZGVmYXVsdMDAwJihcgsMwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA3AwJDAwpmhZAkABgiRBsDCmaFppm5lZ2F0ZZIGEcABp2RlZmF1bHTAwMCYoXILBsDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgNwMCQwMKZoWQJAAoMkQrAwpmhaaZwaWNrQnmSChDAAqdkZWZhdWx0wMDAmKFyCwbAwJEJwMKcoWkBAQkNkQzAwgLCwMCYoWcIDcDAkMDCl6FvAQAOE5DAmaFkABAPwJQQERIPwMKZoWymb21pdEJ5kg8VwMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9vbWl0QnkuanOYoXIJBsAQkQ7Awpihch8GwBGRCcDCmKFyCQbAEpEFwMKYoXIBDMDAkQHAwpihZwEDFMCQwMKYoWcJCxXAkRXAwpihcgAGwMCRDsDC
====catalogjs annotation end====*/