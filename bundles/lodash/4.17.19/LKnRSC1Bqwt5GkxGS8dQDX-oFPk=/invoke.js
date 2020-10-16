import { default as baseInvoke } from "./dist/8.js";
import { default as baseRest } from "./dist/49.js";



/**
 * Invokes the method at `path` of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the method to invoke.
 * @param {...*} [args] The arguments to invoke the method with.
 * @returns {*} Returns the result of the invoked method.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': [1, 2, 3, 4] } }] };
 *
 * _.invoke(object, 'a[0].b.c.slice', 1, 3);
 * // => [2, 3]
 */

var invoke = baseRest(baseInvoke);

export { invoke as default };
/*====catalogjs annotation start====
lZKVwqsuL2Rpc3QvOC5qcwHCwJXCrC4vZGlzdC80OS5qcwXCwIGnZGVmYXVsdJShbKZpbnZva2UOwJGTDsDAg6piYXNlSW52b2tlm6FpkMICwJIDBMAAwKdkZWZhdWx0kKhiYXNlUmVzdJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCmaW52b2tlm6FskqhiYXNlUmVzdKpiYXNlSW52b2tlwgoNkgsMwMDAwJKqYmFzZUludm9rZahiYXNlUmVzdJ+WAAABwMLDlgAWAgXCwpYJAAPAwsKWCwrAwMLClgEKwMDCwpYBFwYJwsKWCQAHwMLClgsIwMDCwpYACMAEwsKWzQHvAQoOwsKWBAALwMLClgAGwA3CwpYJBsDAwsKWAwEIwMLClgIODMDCwg==
====catalogjs annotation end====*/