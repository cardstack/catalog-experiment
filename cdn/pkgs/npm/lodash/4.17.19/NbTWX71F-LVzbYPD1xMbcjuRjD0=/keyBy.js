import { default as baseAssignValue } from "./dist/56.js";
import { default as createAggregator } from "./dist/2.js";
var keyBy = createAggregator(function (result, value, key) {
  baseAssignValue(result, key, value);
});
export { keyBy as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNTYuanMDwsCVwqsuL2Rpc3QvMi5qcwbCwIGnZGVmYXVsdJWhbKVrZXlCeQ/AwNwAEZehbwAAA8CRCcCZoWQJAALAkQLAwpmhaa9iYXNlQXNzaWduVmFsdWWSAg3AAKdkZWZhdWx0wMDAmKFyCw/AwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFpsGNyZWF0ZUFnZ3JlZ2F0b3KSBQzAAadkZWZhdWx0wMDAmKFyCxDAwJEEwMKcoWkBFgQHkMDCAcLAwJehbwEACA6QwJihZwABCcCQwMKZoWQEAArAkwoIC8DCmaFspWtleUJ5kgoQwMDACJDZRVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9rZXlCeS5qc5ihcgAFwAuRCcDCmKFnAxgMwJIMDcDCmKFyABDADZEEwMKYoXIjD8DAkQHAwpihZwEDD8CQwMKYoWcJCxDAkRDAwpihcgAFwMCRCcDC
====catalogjs annotation end====*/