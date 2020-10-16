import { default as LazyWrapper } from "./dist/103.js";
import { default as LodashWrapper } from "./dist/104.js";
import { default as reverse } from "./reverse.js";
import { default as thru } from "./thru.js";





/**
 * This method is the wrapper version of `_.reverse`.
 *
 * **Note:** This method mutates the wrapped array.
 *
 * @name reverse
 * @memberOf _
 * @since 0.1.0
 * @category Seq
 * @returns {Object} Returns the new `lodash` wrapper instance.
 * @example
 *
 * var array = [1, 2, 3];
 *
 * _(array).reverse().value()
 * // => [3, 2, 1]
 *
 * console.log(array);
 * // => [3, 2, 1]
 */

function wrapperReverse() {
  var value = this.__wrapped__;

  if (value instanceof LazyWrapper) {
    var wrapped = value;

    if (this.__actions__.length) {
      wrapped = new LazyWrapper(this);
    }

    wrapped = wrapped.reverse();

    wrapped.__actions__.push({
      'func': thru,
      'args': [reverse],
      'thisArg': undefined
    });

    return new LodashWrapper(wrapped, this.__chain__);
  }

  return this.thru(reverse);
}


export { wrapperReverse as default };
/*====catalogjs annotation start====
lZSVwq0uL2Rpc3QvMTAzLmpzAcLAlcKtLi9kaXN0LzEwNC5qcwbCwJXCrC4vcmV2ZXJzZS5qcwrCwJXCqS4vdGhydS5qcw/CwIGnZGVmYXVsdJShbK53cmFwcGVyUmV2ZXJzZRbAkZMWwMCFq0xhenlXcmFwcGVym6FpkMICwJMDBAXAAMCnZGVmYXVsdJCtTG9kYXNoV3JhcHBlcpuhaZDCB8CSCAnAAcCnZGVmYXVsdJCncmV2ZXJzZZuhaZDCC8CTDA0OwALAp2RlZmF1bHSQpHRocnWboWmQwhDAkhESwAPAp2RlZmF1bHSQrndyYXBwZXJSZXZlcnNlm6FslKtMYXp5V3JhcHBlcqR0aHJ1p3JldmVyc2WtTG9kYXNoV3JhcHBlcsITwJIUFcDAwMCQ3AAXlgAAAcDCw5YAGAIGwsKWCQADwMLClgsLwMDCwpY9C8AFwsKWVQvAEsLClgEYBwrCwpYJAAjAwsKWCw3AwMLCljYNwA7CwpYBFwsPwsKWCQAMwMLClgsHwMDCwpYRB8AJwsKWMwfAwMLClgEUEBPCwpYJABHAwsKWCwTAwMLCll4EwA3CwpbNAYoEFBbCwpYJDsAEwsKWCQ7AwMLClgMOFcDCwg==
====catalogjs annotation end====*/