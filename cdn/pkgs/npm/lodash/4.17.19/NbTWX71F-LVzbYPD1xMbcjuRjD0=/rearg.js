import { default as createWrap } from "./dist/23.js";
import { default as flatRest } from "./dist/50.js";
var WRAP_REARG_FLAG = 256;
var rearg = flatRest(function (func, indexes) {
  return createWrap(func, WRAP_REARG_FLAG, undefined, undefined, undefined, indexes);
});
export { rearg as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvMjMuanMDwsCVwqwuL2Rpc3QvNTAuanMHwsCBp2RlZmF1bHSVoWylcmVhcmcVwMDcABeXoW8AAAPAkQ7AmaFkCQACBJECwMKZoWmqY3JlYXRlV3JhcJICEsAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaahmbGF0UmVzdJIGEcABp2RlZmF1bHTAwMCYoXILCMDAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgOwMCQwMKXoW8BAAoUkMCYoWcAAQsNkMDCmaFkBAYMwJIMCsDCmaFsr1dSQVBfUkVBUkdfRkxBR5IME8DAwAqQ2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcmVhcmcuanOYoXIAD8DAkQvAwpihZwEBDsCQwMKZoWQEAA/AlA8NEAvAwpmhbKVyZWFyZ5IPFsDAwA2Q2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcmVhcmcuanOYoXIABcAQkQ7AwpihZwMvEcCTERITwMKYoXIACMASkQXAwpihciUKwBORAcDCmKFyBw/AwJELwMKYoWcBAxXAkMDCmKFnCQsWwJEWwMKYoXIABcDAkQ7Awg==
====catalogjs annotation end====*/