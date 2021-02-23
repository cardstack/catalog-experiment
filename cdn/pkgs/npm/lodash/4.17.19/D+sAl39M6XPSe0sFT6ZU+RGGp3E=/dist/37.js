import { default as LazyWrapper } from "./103.js";
import { default as getData } from "./38.js";
import { default as getFuncName } from "./115.js";
import { default as lodash } from "../wrapperLodash.js";
function isLaziable(func) {
  var funcName = getFuncName(func),
      other = lodash[funcName];

  if (typeof other != 'function' || !(funcName in LazyWrapper.prototype)) {
    return false;
  }

  if (func === other) {
    return true;
  }

  var data = getData(other);
  return !!data && func === data[0];
}
export { isLaziable as default };
/*====catalogjs annotation start====
k5SVwqguLzEwMy5qcwPCwJXCpy4vMzguanMHwsCVwqguLzExNS5qcwvCwJXCsy4uL3dyYXBwZXJMb2Rhc2guanMPwsCBp2RlZmF1bHSVoWyqaXNMYXppYWJsZRnAwNwAG5ehbwAAA8CQwJmhZAkAAgSRAsDCmaFpq0xhenlXcmFwcGVykgIWwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCArAwJDAwpmhZAkABgiRBsDCmaFpp2dldERhdGGSBhfAAadkZWZhdWx0wMDAmKFyCwfAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcICcDAkMDCmaFkCQAKDJEKwMKZoWmrZ2V0RnVuY05hbWWSChTAAqdkZWZhdWx0wMDAmKFyCwvAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcICsDAkMDCmaFkCQAOEJEOwMKZoWmmbG9kYXNokg4VwAOnZGVmYXVsdMDAwJihcgsGwMCRDcDCnKFpAQENEZEQwMIDwsDAmKFnCBXAwJDAwpehbwEAEhiQwJmhZAAvE8CVFBUWFxPAwpmhbKppc0xhemlhYmxlkhMawMDAwJDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9faXNMYXppYWJsZS5qc5ihcgkKwBSREsDCmKFyGgvAFZEJwMKYoXIWBsAWkQ3Awpihcj8LwBeRAcDCmKFyYQfAwJEFwMKYoWcBAxnAkMDCmKFnCQsawJEawMKYoXIACsDAkRLAwg==
====catalogjs annotation end====*/