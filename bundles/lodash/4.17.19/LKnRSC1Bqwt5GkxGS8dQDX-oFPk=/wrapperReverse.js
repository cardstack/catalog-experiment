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

const _default = (wrapperReverse);
export { _default as default };
/*====catalogjs annotation start====
lZSTwq0uL2Rpc3QvMTAzLmpzAZPCrS4vZGlzdC8xMDQuanMGk8KsLi9yZXZlcnNlLmpzCpPCqS4vdGhydS5qcw+Bp2RlZmF1bHSUoWyoX2RlZmF1bHQawJGTGsDChqtMYXp5V3JhcHBlcpuhaZDCAsCTAwQFwADAp2RlZmF1bHSQrUxvZGFzaFdyYXBwZXKboWmQwgfAkggJwAHAp2RlZmF1bHSQp3JldmVyc2WboWmQwgvAkwwNDsACwKdkZWZhdWx0kKR0aHJ1m6FpkMIQwJIREsADwKdkZWZhdWx0kK53cmFwcGVyUmV2ZXJzZZuhbJSrTGF6eVdyYXBwZXKkdGhydadyZXZlcnNlrUxvZGFzaFdyYXBwZXLCE8CSFBXAwMDAkKhfZGVmYXVsdJuhbJGud3JhcHBlclJldmVyc2XCF8CSGBnAwMDAkNwAG5YAAAHAwsOWABgCBsLClgkAA8DCwpYLC8DAwsKWPQvABcLCllULwBLCwpYBGAcKwsKWCQAIwMLClgsNwMDCwpY2DcAOwsKWARcLD8LClgkADMDCwpYLB8DAwsKWEQfACcLCljMHwMDCwpYBFBATwsKWCQARwMLClgsEwMDCwpZeBMANwsKWzQGKBBQWwsKWCQ7ABMLClgQOwMDCwpYCARcawsKWBgEYwMLClgAIwBXCwpYJCMDAwsKWAQ4ZwMLC
====catalogjs annotation end====*/