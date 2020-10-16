import { default as baseFlatten } from "./dist/85.js";
import { default as baseOrderBy } from "./dist/4.js";
import { default as baseRest } from "./dist/49.js";
import { default as isIterateeCall } from "./dist/70.js";





/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection thru each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order of
 * equal elements. The iteratees are invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {...(Function|Function[])} [iteratees=[_.identity]]
 *  The iteratees to sort by.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 40 },
 *   { 'user': 'barney', 'age': 34 }
 * ];
 *
 * _.sortBy(users, [function(o) { return o.user; }]);
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 *
 * _.sortBy(users, ['user', 'age']);
 * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
 */

var sortBy = baseRest(function (collection, iteratees) {
  if (collection == null) {
    return [];
  }

  var length = iteratees.length;

  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }

  return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
});

export { sortBy as default };
/*====catalogjs annotation start====
lZSVwqwuL2Rpc3QvODUuanMBwsCVwqsuL2Rpc3QvNC5qcwXCwJXCrC4vZGlzdC80OS5qcwnCwJXCrC4vZGlzdC83MC5qcw3CwIGnZGVmYXVsdJShbKZzb3J0QnkXwJGTF8DAhatiYXNlRmxhdHRlbpuhaZDCAsCSAwTAAMCnZGVmYXVsdJCrYmFzZU9yZGVyQnmboWmQwgbAkgcIwAHAp2RlZmF1bHSQqGJhc2VSZXN0m6FpkMIKwJILDMACwKdkZWZhdWx0kK5pc0l0ZXJhdGVlQ2FsbJuhaZDCDsCTDxARwAPAp2RlZmF1bHSQpnNvcnRCeZuhbJSoYmFzZVJlc3SuaXNJdGVyYXRlZUNhbGyrYmFzZU9yZGVyQnmrYmFzZUZsYXR0ZW7CExaSFBXAwMDAlKtiYXNlRmxhdHRlbqtiYXNlT3JkZXJCeahiYXNlUmVzdK5pc0l0ZXJhdGVlQ2FsbNwAGJYAAAHAwsOWABcCBcLClgkAA8DCwpYLC8DAwsKWDQvAwMLClgEWBgnCwpYJAAfAwsKWCwvAwMLCllwLwATCwpYBFwoNwsKWCQALwMLClgsIwMDCwpYACMAQwsKWARcOEsLClgkAD8DCwpYLDsDAwsKWzIoOwBHCwpZbDsAIwsKWzQQSARMXwsKWBAAUwMLClgAGwBbCwpYJBsDAwsKWAxcMwMLClgIOFcDCwg==
====catalogjs annotation end====*/