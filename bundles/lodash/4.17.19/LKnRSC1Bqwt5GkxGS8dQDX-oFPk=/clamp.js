import { default as baseClamp } from "./dist/148.js";
import { default as toNumber } from "./toNumber.js";



/**
 * Clamps `number` within the inclusive `lower` and `upper` bounds.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Number
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 * @example
 *
 * _.clamp(-10, -5, 5);
 * // => -5
 *
 * _.clamp(10, -5, 5);
 * // => 5
 */

function clamp(number, lower, upper) {
  if (upper === undefined) {
    upper = lower;
    lower = undefined;
  }

  if (upper !== undefined) {
    upper = toNumber(upper);
    upper = upper === upper ? upper : 0;
  }

  if (lower !== undefined) {
    lower = toNumber(lower);
    lower = lower === lower ? lower : 0;
  }

  return baseClamp(toNumber(number), lower, upper);
}

const _default = (clamp);
export { _default as default };
/*====catalogjs annotation start====
lZKTwq0uL2Rpc3QvMTQ4LmpzAZPCrS4vdG9OdW1iZXIuanMFgadkZWZhdWx0lKFsqF9kZWZhdWx0EsCRkxLAwoSpYmFzZUNsYW1wm6FpkMICwJIDBMAAwKdkZWZhdWx0kKh0b051bWJlcpuhaZDCBsCUBwgJCsABwKdkZWZhdWx0kKVjbGFtcJuhbJKodG9OdW1iZXKpYmFzZUNsYW1wwgvAkgwNwMDAwJCoX2RlZmF1bHSboWyRpWNsYW1wwg/AkhARwMDAwJDcABOWAAABwMLDlgAYAgXCwpYJAAPAwsKWCwnAwMLClkAJwArCwpYBGAYLwsKWCQAHwMLClgsIwMDCwpbMjgjACcLClmAIwATCwpYBCMDAwsKWzQGgGgwOwsKWCQXACMLClgQFwMDCwpYCAQ8SwsKWBgEQwMLClgAIwA3CwpYJCMDAwsKWAQ4RwMLC
====catalogjs annotation end====*/