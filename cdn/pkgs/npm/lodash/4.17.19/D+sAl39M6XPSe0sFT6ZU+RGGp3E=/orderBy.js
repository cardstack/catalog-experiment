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
k5KVwqsuL2Rpc3QvNC5qcwPCwJXCrC4vaXNBcnJheS5qcwfCwIGnZGVmYXVsdJWhbKdvcmRlckJ5EMDA3AASl6FvAAADwJDAmaFkCQACBJECwMKZoWmrYmFzZU9yZGVyQnmSAg7AAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDcDAkMDCmaFkCQAGCJEGwMKZoWmnaXNBcnJheZMGDA3AAadkZWZhdWx0wMDAmKFyCwfAwJEFwMKcoWkBAQUJkQjAwgHCwMCYoWcIDsDAkMDCl6FvAQAKD5DAmaFkACILwJQMDQ4LwMKZoWynb3JkZXJCeZILEcDAwMCQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvb3JkZXJCeS5qc5ihcgkHwAyRCsDCmKFyYAfADZEFwMKYoXJ5B8AOkQXAwpihckcLwMCRAcDCmKFnAQMQwJDAwpihZwkLEcCREcDCmKFyAAfAwJEKwMI=
====catalogjs annotation end====*/