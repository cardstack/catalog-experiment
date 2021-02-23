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
k5KVwqguLzEwNi5qcwPCwJXCqC4vMTE0LmpzB8LAgadkZWZhdWx0laFsq0xhenlXcmFwcGVyF8DA3AAZl6FvAAADwJEQwJmhZAkAAgSRAsDCmaFpqmJhc2VDcmVhdGWSAhLAAKdkZWZhdWx0wMDAmKFyCwrAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcICsDAkMDCmaFkCQAGCJEGwMKZoWmqYmFzZUxvZGFzaJIGE8ABp2RlZmF1bHTAwMCYoXILCsDAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgKwMCQwMKXoW8BAAoWkMCYoWcAAQsNkMDCmaFkBA0MwJIMCsDCmaFssE1BWF9BUlJBWV9MRU5HVEiSDA/AwMAKkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19MYXp5V3JhcHBlci5qc5ihcgAQwMCRC8DCmaFkARoOEJMPDgvAwpmhbKtMYXp5V3JhcHBlcpUOERQVGMDAwMCRENlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19MYXp5V3JhcHBlci5qc5ihcgkLwA+RDcDCmKFyzKIQwMCRC8DCmKFnAQERwJUREhMUFcDDmKFyAAvAEpENwMKYoXINCsATkQHAwpihcgEKwBSRBcDCmKFyDQvAFZENwMKYoXIZC8DAkQ3AwpihZwEDF8CQwMKYoWcJCxjAkRjAwpihcgALwMCRDcDC
====catalogjs annotation end====*/