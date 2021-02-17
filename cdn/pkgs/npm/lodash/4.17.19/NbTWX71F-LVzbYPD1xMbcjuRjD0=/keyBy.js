import { default as baseAssignValue } from "./dist/56.js";
import { default as createAggregator } from "./dist/2.js";
var keyBy = createAggregator(function (result, value, key) {
  baseAssignValue(result, key, value);
});
export { keyBy as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNTYuanMDwsCVwqsuL2Rpc3QvMi5qcwfCwIGnZGVmYXVsdJWhbKVrZXlCeRHAwNwAE5ehbwAAA8CRC8CZoWQJAAIEkQLAwpmhaa9iYXNlQXNzaWduVmFsdWWSAg/AAKdkZWZhdWx0wMDAmKFyCw/AwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmwY3JlYXRlQWdncmVnYXRvcpIGDsABp2RlZmF1bHTAwMCYoXILEMDAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgNwMCQwMKXoW8BAAoQkMCYoWcAAQvAkMDCmaFkBAAMwJMMCg3AwpmhbKVrZXlCeZIMEsDAwAqQ2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMva2V5QnkuanOYoXIABcANkQvAwpihZwMYDsCSDg/AwpihcgAQwA+RBcDCmKFyIw/AwJEBwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIABcDAkQvAwg==
====catalogjs annotation end====*/