import { default as baseAssign } from "./dist/52.js";
import { default as baseCreate } from "./dist/106.js";



/**
 * Creates an object that inherits from the `prototype` object. If a
 * `properties` object is given, its own enumerable string keyed properties
 * are assigned to the created object.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Object
 * @param {Object} prototype The object to inherit from.
 * @param {Object} [properties] The properties to assign to the object.
 * @returns {Object} Returns the new object.
 * @example
 *
 * function Shape() {
 *   this.x = 0;
 *   this.y = 0;
 * }
 *
 * function Circle() {
 *   Shape.call(this);
 * }
 *
 * Circle.prototype = _.create(Shape.prototype, {
 *   'constructor': Circle
 * });
 *
 * var circle = new Circle;
 * circle instanceof Circle;
 * // => true
 *
 * circle instanceof Shape;
 * // => true
 */

function create(prototype, properties) {
  var result = baseCreate(prototype);
  return properties == null ? result : baseAssign(result, properties);
}

const _default = (create);
export { _default as default };
/*====catalogjs annotation start====
lZKTwqwuL2Rpc3QvNTIuanMBk8KtLi9kaXN0LzEwNi5qcwWBp2RlZmF1bHSUoWyoX2RlZmF1bHQQwJGTEMDChKpiYXNlQXNzaWdum6FpkMICwJIDBMAAwKdkZWZhdWx0kKpiYXNlQ3JlYXRlm6FpkMIGwJIHCMABwKdkZWZhdWx0kKZjcmVhdGWboWySqmJhc2VDcmVhdGWqYmFzZUFzc2lnbsIJwJIKC8DAwMCQqF9kZWZhdWx0m6FskaZjcmVhdGXCDcCSDg/AwMDAkNwAEZYAAAHAwsOWABcCBcLClgkAA8DCwpYLCsDAwsKWNArAwMLClgEYBgnCwpYJAAfAwsKWCwrAwMLClikKwATCwpbNAwQXCgzCwpYJBsAIwsKWBAbAwMLClgIBDRDCwpYGAQ7AwsKWAAjAC8LClgkIwMDCwpYBDg/AwsI=
====catalogjs annotation end====*/