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
k5KVwqsuL2Rpc3QvNC5qcwPCwJXCrC4vaXNBcnJheS5qcwbCwIGnZGVmYXVsdJShbKdvcmRlckJ5DsDcABCXoW8AAAPAkMCZoWQJAALAkQLAwpihaatiYXNlT3JkZXJCeZICDMAAp2RlZmF1bHTAwJihcgsLwMCRAcDCnKFpABYBBpDAwgDCwMCZoWQJAAXAkQXAwpihaadpc0FycmF5kwUKC8ABp2RlZmF1bHTAwJihcgsHwMCRBMDCnKFpARcEB5DAwgHCwMCXoW8BAAgNkMCZoWQAIgnAlAoLDAnAwpihbKdvcmRlckJ5kgkPwMDAwNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL29yZGVyQnkuanOYoXIJB8AKkQjAwpihcmAHwAuRBMDCmKFyeQfADJEEwMKYoXJHC8DAkQHAwpihZwEDDsCQwMKYoWcJCw/AkQ/AwpihcgAHwMCRCMDC
====catalogjs annotation end====*/