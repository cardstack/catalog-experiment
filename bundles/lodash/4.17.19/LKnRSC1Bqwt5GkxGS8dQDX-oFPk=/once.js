import { default as before } from "./before.js";


/**
 * Creates a function that is restricted to invoking `func` once. Repeat calls
 * to the function return the value of the first invocation. The `func` is
 * invoked with the `this` binding and arguments of the created function.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * var initialize = _.once(createApplication);
 * initialize();
 * initialize();
 * // => `createApplication` is invoked once
 */

function once(func) {
  return before(2, func);
}

const _default = (once);
export { _default as default };
/*====catalogjs annotation start====
lZGTwqsuL2JlZm9yZS5qcwGBp2RlZmF1bHSUoWyoX2RlZmF1bHQMwJGTDMDCg6ZiZWZvcmWboWmQwgLAkgMEwADAp2RlZmF1bHSQpG9uY2WboWyRpmJlZm9yZcIFwJIGB8DAwMCQqF9kZWZhdWx0m6FskaRvbmNlwgnAkgoLwMDAwJCdlgAAAcDCw5YAFgIFwsKWCQADwMLClgsGwMDCwpYSBsDAwsKWzQIwDAYIwsKWCQTABMLClgQEwMDCwpYCAQkMwsKWBgEKwMLClgAIwAfCwpYJCMDAwsKWAQ4LwMLC
====catalogjs annotation end====*/