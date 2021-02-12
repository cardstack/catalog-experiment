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
k5SVwqguLzEwMy5qcwPCwJXCpy4vMzguanMGwsCVwqguLzExNS5qcwnCwJXCsy4uL3dyYXBwZXJMb2Rhc2guanMMwsCBp2RlZmF1bHSVoWyqaXNMYXppYWJsZRXAwNwAF5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpq0xhenlXcmFwcGVykgISwACnZGVmYXVsdMDAwJihcgsLwMCRAcDCnKFpABMBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaadnZXREYXRhkgUTwAGnZGVmYXVsdMDAwJihcgsHwMCRBMDCnKFpARIECZDAwgHCwMCZoWQJAAjAkQjAwpmhaatnZXRGdW5jTmFtZZIIEMACp2RlZmF1bHTAwMCYoXILC8DAkQfAwpyhaQETBwyQwMICwsDAmaFkCQALwJELwMKZoWmmbG9kYXNokgsRwAOnZGVmYXVsdMDAwJihcgsGwMCRCsDCnKFpAR4KDZDAwgPCwMCXoW8BAA4UkMCZoWQALw/AlRAREhMPwMKZoWyqaXNMYXppYWJsZZIPFsDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2lzTGF6aWFibGUuanOYoXIJCsAQkQ7AwpihchoLwBGRB8DCmKFyFgbAEpEKwMKYoXI/C8ATkQHAwpihcmEHwMCRBMDCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAArAwJEOwMI=
====catalogjs annotation end====*/