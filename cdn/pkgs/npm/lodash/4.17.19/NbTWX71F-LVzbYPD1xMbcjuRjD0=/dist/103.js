import { default as baseCreate } from "./106.js";
import { default as baseLodash } from "./114.js";
var MAX_ARRAY_LENGTH = 4294967295;
function LazyWrapper(value) {
  this.__wrapped__ = value;
  this.__actions__ = [];
  this.__dir__ = 1;
  this.__filtered__ = false;
  this.__iteratees__ = [];
  this.__takeCount__ = MAX_ARRAY_LENGTH;
  this.__views__ = [];
}
LazyWrapper.prototype = baseCreate(baseLodash.prototype);
LazyWrapper.prototype.constructor = LazyWrapper;
export { LazyWrapper as default };
/*====catalogjs annotation start====
k5KVwqguLzEwNi5qcwPCwJXCqC4vMTE0LmpzBsLAgadkZWZhdWx0laFsq0xhenlXcmFwcGVyFcDA3AAXl6FvAAADwJEOwJmhZAkAAsCRAsDCmaFpqmJhc2VDcmVhdGWSAhDAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAEwEGkMDCAMLAwJmhZAkABcCRBcDCmaFpqmJhc2VMb2Rhc2iSBRHAAadkZWZhdWx0wMDAmKFyCwrAwJEEwMKcoWkBEwQHkMDCAcLAwJehbwEACBSQwJihZwABCQuQwMKZoWQEDQrAkgoIwMKZoWywTUFYX0FSUkFZX0xFTkdUSJIKDcDAwAiQ2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX0xhenlXcmFwcGVyLmpzmKFyABDAwJEJwMKZoWQBGgwOkw0MCcDCmaFsq0xhenlXcmFwcGVylQwPEhMWwMDAwJEO2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX0xhenlXcmFwcGVyLmpzmKFyCQvADZELwMKYoXLMohDAwJEJwMKYoWcBAQ/AlQ8QERITwMOYoXIAC8AQkQvAwpihcg0KwBGRAcDCmKFyAQrAEpEEwMKYoXINC8ATkQvAwpihchkLwMCRC8DCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAAvAwJELwMI=
====catalogjs annotation end====*/