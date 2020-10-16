import { default as LodashWrapper } from "./dist/104.js";


/**
 * Executes the chain sequence and returns the wrapped result.
 *
 * @name commit
 * @memberOf _
 * @since 3.2.0
 * @category Seq
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * var array = [1, 2];
 * var wrapped = _(array).push(3);
 *
 * console.log(array);
 * // => [1, 2]
 *
 * wrapped = wrapped.commit();
 * console.log(array);
 * // => [1, 2, 3]
 *
 * wrapped.last();
 * // => 3
 *
 * console.log(array);
 * // => [1, 2, 3]
 */

function wrapperCommit() {
  return new LodashWrapper(this.value(), this.__chain__);
}


export { wrapperCommit as default };
/*====catalogjs annotation start====
lZGVwq0uL2Rpc3QvMTA0LmpzAcLAgadkZWZhdWx0lKFsrXdyYXBwZXJDb21taXQIwJGTCMDAgq1Mb2Rhc2hXcmFwcGVym6FpkMICwJIDBMAAwKdkZWZhdWx0kK13cmFwcGVyQ29tbWl0m6Fska1Mb2Rhc2hXcmFwcGVywgXAkgYHwMDAwJCZlgAAAcDCw5YAGAIFwsKWCQADwMLClgsNwMDCwpYSDcDAwsKWzQHbIQYIwsKWCQ3ABMLClgkNwMDCwpYDDgfAwsI=
====catalogjs annotation end====*/