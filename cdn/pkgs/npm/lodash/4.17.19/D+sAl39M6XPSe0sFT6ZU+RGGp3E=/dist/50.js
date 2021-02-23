import { default as flatten } from "../flatten.js";
import { default as overRest } from "./110.js";
import { default as setToString } from "./51.js";
function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}
export { flatRest as default };
/*====catalogjs annotation start====
k5OVwq0uLi9mbGF0dGVuLmpzA8LAlcKoLi8xMTAuanMHwsCVwqcuLzUxLmpzC8LAgadkZWZhdWx0laFsqGZsYXRSZXN0FMDA3AAWl6FvAAADwJDAmaFkCQACBJECwMKZoWmnZmxhdHRlbpICEsAAp2RlZmF1bHTAwMCYoXILB8DAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgPwMCQwMKZoWQJAAYIkQbAwpmhaahvdmVyUmVzdJIGEcABp2RlZmF1bHTAwMCYoXILCMDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgKwMCQwMKZoWQJAAoMkQrAwpmhaatzZXRUb1N0cmluZ5IKEMACp2RlZmF1bHTAwMCYoXILC8DAkQnAwpyhaQEBCQ2RDMDCAsLAwJihZwgJwMCQwMKXoW8BAA4TkMCZoWQAEA/AlBAREg/AwpmhbKhmbGF0UmVzdJIPFcDAwMCQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2ZsYXRSZXN0LmpzmKFyCQjAEJEOwMKYoXISC8ARkQnAwpihcgEIwBKRBcDCmKFyEgfAwJEBwMKYoWcBAxTAkMDCmKFnCQsVwJEVwMKYoXIACMDAkQ7Awg==
====catalogjs annotation end====*/