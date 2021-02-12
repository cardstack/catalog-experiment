import { default as baseOrderBy } from "./dist/4.js";
import { default as isArray } from "./isArray.js";
function orderBy(collection, iteratees, orders, guard) {
  if (collection == null) {
    return [];
  }

  if (!isArray(iteratees)) {
    iteratees = iteratees == null ? [] : [iteratees];
  }

  orders = guard ? undefined : orders;

  if (!isArray(orders)) {
    orders = orders == null ? [] : [orders];
  }

  return baseOrderBy(collection, iteratees, orders);
}
export { orderBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNC5qcwPCwJXCrC4vaXNBcnJheS5qcwbCwIGnZGVmYXVsdJWhbKdvcmRlckJ5DsDA3AAQl6FvAAADwJDAmaFkCQACwJECwMKZoWmrYmFzZU9yZGVyQnmSAgzAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAFgEGkMDCAMLAwJmhZAkABcCRBcDCmaFpp2lzQXJyYXmTBQoLwAGnZGVmYXVsdMDAwJihcgsHwMCRBMDCnKFpARcEB5DAwgHCwMCXoW8BAAgNkMCZoWQAIgnAlAoLDAnAwpmhbKdvcmRlckJ5kgkPwMDAwJDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9vcmRlckJ5LmpzmKFyCQfACpEIwMKYoXJgB8ALkQTAwpihcnkHwAyRBMDCmKFyRwvAwJEBwMKYoWcBAw7AkMDCmKFnCQsPwJEPwMKYoXIAB8DAkQjAwg==
====catalogjs annotation end====*/