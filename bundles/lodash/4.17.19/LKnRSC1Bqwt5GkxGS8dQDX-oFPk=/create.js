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


export { create as default };
/*====catalogjs annotation start====
lZKVwqwuL2Rpc3QvNTIuanMBwsCVwq0uL2Rpc3QvMTA2LmpzBcLAgadkZWZhdWx0lKFspmNyZWF0ZQzAkZMMwMCDqmJhc2VBc3NpZ26boWmQwgLAkgMEwADAp2RlZmF1bHSQqmJhc2VDcmVhdGWboWmQwgbAkgcIwAHAp2RlZmF1bHSQpmNyZWF0ZZuhbJKqYmFzZUNyZWF0ZapiYXNlQXNzaWduwgnAkgoLwMDAwJCdlgAAAcDCw5YAFwIFwsKWCQADwMLClgsKwMDCwpY0CsDAwsKWARgGCcLClgkAB8DCwpYLCsDAwsKWKQrABMLCls0DBBcKDMLClgkGwAjCwpYJBsDAwsKWAw4LwMLC
====catalogjs annotation end====*/