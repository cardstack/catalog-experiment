/**
 * Enables the wrapper to be iterable.
 *
 * @name Symbol.iterator
 * @memberOf _
 * @since 4.0.0
 * @category Seq
 * @returns {Object} Returns the wrapper object.
 * @example
 *
 * var wrapped = _([1, 2]);
 *
 * wrapped[Symbol.iterator]() === wrapped;
 * // => true
 *
 * Array.from(wrapped);
 * // => [1, 2]
 */
function wrapperToIterator() {
  return this;
}


export { wrapperToIterator as default };
/*====catalogjs annotation start====
lZCBp2RlZmF1bHSUoWyxd3JhcHBlclRvSXRlcmF0b3IEwJGTBMDAgbF3cmFwcGVyVG9JdGVyYXRvcpuhbJDCAcCSAgPAwMDAkJWWAAABwMLDls0BPhUCBMLClgkRwMDCwpYJEcDAwsKWAw4DwMLC
====catalogjs annotation end====*/