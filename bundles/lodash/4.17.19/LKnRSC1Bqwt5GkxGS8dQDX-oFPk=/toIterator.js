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

const _default = (wrapperToIterator);
export { _default as default };
/*====catalogjs annotation start====
lZCBp2RlZmF1bHSUoWyoX2RlZmF1bHQIwJGTCMDCgrF3cmFwcGVyVG9JdGVyYXRvcpuhbJDCAcCSAgPAwMDAkKhfZGVmYXVsdJuhbJGxd3JhcHBlclRvSXRlcmF0b3LCBcCSBgfAwMDAkJmWAAABwMLDls0BPhUCBMLClgkRwMDCwpYEEcDAwsKWAgEFCMLClgYBBsDCwpYACMADwsKWCQjAwMLClgEOB8DCwg==
====catalogjs annotation end====*/