import { default as LazyWrapper } from "./dist/103.js";
import { default as LodashWrapper } from "./dist/104.js";
import { default as reverse } from "./reverse.js";
import { default as thru } from "./thru.js";
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
k5SVwq0uL2Rpc3QvMTAzLmpzA8LAlcKtLi9kaXN0LzEwNC5qcwfCwJXCrC4vcmV2ZXJzZS5qcwvCwJXCqS4vdGhydS5qcw/CwIGnZGVmYXVsdJWhbK53cmFwcGVyUmV2ZXJzZRvAwNwAHZehbwAAA8CQwJmhZAkAAgSRAsDCmaFpq0xhenlXcmFwcGVykwIUFcAAp2RlZmF1bHTAwMCYoXILC8DAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgPwMCQwMKZoWQJAAYIkQbAwpmhaa1Mb2Rhc2hXcmFwcGVykgYYwAGnZGVmYXVsdMDAwJihcgsNwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA/AwJDAwpmhZAkACgyRCsDCmaFpp3JldmVyc2WTChcZwAKnZGVmYXVsdMDAwJihcgsHwMCRCcDCnKFpAQEJD5EMwMICwsDAmKFnCA7AwJDAwpmhZAkADhCRDsDCmaFppHRocnWSDhbAA6dkZWZhdWx0wMDAmKFyCwTAwJENwMKcoWkBAQ0RkRDAwgPCwMCYoWcIC8DAkMDCl6FvAQASGpDAmaFkAAQTwJcUFRYXGBkTwMKZoWyud3JhcHBlclJldmVyc2WSExzAwMDAkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3dyYXBwZXJSZXZlcnNlLmpzmKFyCQ7AFJESwMKYoXI9C8AVkQHAwpihclULwBaRAcDCmKFyXgTAF5ENwMKYoXIRB8AYkQnAwpihcjYNwBmRBcDCmKFyMwfAwJEJwMKYoWcBAxvAkMDCmKFnCQscwJEcwMKYoXIADsDAkRLAwg==
====catalogjs annotation end====*/