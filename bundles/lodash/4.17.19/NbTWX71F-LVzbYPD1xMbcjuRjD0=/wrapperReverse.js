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
k5SVwq0uL2Rpc3QvMTAzLmpzA8LAlcKtLi9kaXN0LzEwNC5qcwbCwJXCrC4vcmV2ZXJzZS5qcwnCwJXCqS4vdGhydS5qcwzCwIGnZGVmYXVsdJShbK53cmFwcGVyUmV2ZXJzZRfA3AAZl6FvAAADwJEOwJmhZAkAAsCRAsDCmKFpq0xhenlXcmFwcGVykwIQEcAAp2RlZmF1bHTAwJihcgsLwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaa1Mb2Rhc2hXcmFwcGVykgUUwAGnZGVmYXVsdMDAmKFyCw3AwJEEwMKcoWkBGAQJkMDCAcLAwJmhZAkACMCRCMDCmKFpp3JldmVyc2WTCBMVwAKnZGVmYXVsdMDAmKFyCwfAwJEHwMKcoWkBFwcMkMDCAsLAwJmhZAkAC8CRC8DCmKFppHRocnWSCxLAA6dkZWZhdWx0wMCYoXILBMDAkQrAwpyhaQEUCg2QwMIDwsDAl6FvAQAOFpDAmaFkAAQPwJcQERITFBUPwMKYoWyud3JhcHBlclJldmVyc2WSDxjAwMDA2U5XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvd3JhcHBlclJldmVyc2UuanOYoXIJDsAQkQ7Awpihcj0LwBGRAcDCmKFyVQvAEpEBwMKYoXJeBMATkQrAwpihchEHwBSRB8DCmKFyNg3AFZEEwMKYoXIzB8DAkQfAwpihZwEDF8CQwMKYoWcJCxjAkRjAwpihcgAOwMCRDsDC
====catalogjs annotation end====*/