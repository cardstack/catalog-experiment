import { default as toNumber } from "./toNumber.js";
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }

  value = toNumber(value);

  if (value === INFINITY || value === -INFINITY) {
    var sign = value < 0 ? -1 : 1;
    return sign * MAX_INTEGER;
  }

  return value === value ? value : 0;
}
export { toFinite as default };
/*====catalogjs annotation start====
k5GVwq0uL3RvTnVtYmVyLmpzA8LAgadkZWZhdWx0lKFsqHRvRmluaXRlEcDcABOXoW8AAAPAkMCZoWQJAALAkQLAwpihaah0b051bWJlcpICDMAAp2RlZmF1bHTAwJihcgsIwMCRAcDCnKFpABgBBJDAwgDCwMCXoW8BAAUQkMCYoWcAAQYKkMDCmaFkBAgHCJIHBcDCmKFsqElORklOSVRZkwcNDsDAwAXZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90b0Zpbml0ZS5qc5ihcgAIwMCRBsDCmaFkBhoJwJIJBcDCmKFsq01BWF9JTlRFR0VSkgkPwMDABdlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3RvRmluaXRlLmpzmKFyAAvAwJEIwMKZoWQBLgvAlwwNDg8LBgjAwpihbKh0b0Zpbml0ZZILEsDAwMDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy90b0Zpbml0ZS5qc5ihcgkIwAyRCsDCmKFyTQjADZEBwMKYoXIaCMAOkQbAwpihcg8IwA+RBsDCmKFyOQvAwJEIwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIACMDAkQrAwg==
====catalogjs annotation end====*/