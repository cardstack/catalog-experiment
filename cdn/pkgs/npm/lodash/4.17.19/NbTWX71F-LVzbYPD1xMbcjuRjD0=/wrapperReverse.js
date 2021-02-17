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
k5SVwq0uL2Rpc3QvMTAzLmpzA8LAlcKtLi9kaXN0LzEwNC5qcwbCwJXCrC4vcmV2ZXJzZS5qcwnCwJXCqS4vdGhydS5qcwzCwIGnZGVmYXVsdJWhbK53cmFwcGVyUmV2ZXJzZRfAwNwAGZehbwAAA8CQwJmhZAkAAsCRAsDCmaFpq0xhenlXcmFwcGVykwIQEcAAp2RlZmF1bHTAwMCYoXILC8DAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmtTG9kYXNoV3JhcHBlcpIFFMABp2RlZmF1bHTAwMCYoXILDcDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmncmV2ZXJzZZMIExXAAqdkZWZhdWx0wMDAmKFyCwfAwJEHwMKcoWkBFwcMkMDCAsLAwJmhZAkAC8CRC8DCmaFppHRocnWSCxLAA6dkZWZhdWx0wMDAmKFyCwTAwJEKwMKcoWkBFAoNkMDCA8LAwJehbwEADhaQwJmhZAAED8CXEBESExQVD8DCmaFsrndyYXBwZXJSZXZlcnNlkg8YwMDAwJDZTlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy93cmFwcGVyUmV2ZXJzZS5qc5ihcgkOwBCRDsDCmKFyPQvAEZEBwMKYoXJVC8ASkQHAwpihcl4EwBORCsDCmKFyEQfAFJEHwMKYoXI2DcAVkQTAwpihcjMHwMCRB8DCmKFnAQMXwJDAwpihZwkLGMCRGMDCmKFyAA7AwJEOwMI=
====catalogjs annotation end====*/