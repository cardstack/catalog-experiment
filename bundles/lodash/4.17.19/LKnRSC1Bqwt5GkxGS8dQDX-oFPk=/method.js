import { default as baseInvoke } from "./dist/8.js";
import { default as baseRest } from "./dist/49.js";



/**
 * Creates a function that invokes the method at `path` of a given object.
 * Any additional arguments are provided to the invoked method.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Util
 * @param {Array|string} path The path of the method to invoke.
 * @param {...*} [args] The arguments to invoke the method with.
 * @returns {Function} Returns the new invoker function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': _.constant(2) } },
 *   { 'a': { 'b': _.constant(1) } }
 * ];
 *
 * _.map(objects, _.method('a.b'));
 * // => [2, 1]
 *
 * _.map(objects, _.method(['a', 'b']));
 * // => [2, 1]
 */

var method = baseRest(function (path, args) {
  return function (object) {
    return baseInvoke(object, path, args);
  };
});

export { method as default };
/*====catalogjs annotation start====
lZKVwqsuL2Rpc3QvOC5qcwHCwJXCrC4vZGlzdC80OS5qcwXCwIGnZGVmYXVsdJShbKZtZXRob2QOwJGTDsDAg6piYXNlSW52b2tlm6FpkMICwJIDBMAAwKdkZWZhdWx0kKhiYXNlUmVzdJuhaZDCBsCSBwjAAcCnZGVmYXVsdJCmbWV0aG9km6FskqhiYXNlUmVzdKpiYXNlSW52b2tlwgoNkgsMwMDAwJKqYmFzZUludm9rZahiYXNlUmVzdJ+WAAABwMLDlgAWAgXCwpYJAAPAwsKWCwrAwMLClkEKwMDCwpYBFwYJwsKWCQAHwMLClgsIwMDCwpYACMAEwsKWzQJ3AQoOwsKWBAALwMLClgAGwA3CwpYJBsDAwsKWAx0IwMLClgIODMDCwg==
====catalogjs annotation end====*/