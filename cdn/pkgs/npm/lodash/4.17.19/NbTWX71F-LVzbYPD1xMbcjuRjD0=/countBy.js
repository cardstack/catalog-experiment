import { default as baseAssignValue } from "./dist/56.js";
import { default as createAggregator } from "./dist/2.js";
var objectProto = Object.prototype;
var hasOwnProperty0 = objectProto.hasOwnProperty;
var countBy = createAggregator(function (result, value, key) {
  if (hasOwnProperty0.call(result, key)) {
    ++result[key];
  } else {
    baseAssignValue(result, key, 1);
  }
});
export { countBy as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNTYuanMDwsCVwqsuL2Rpc3QvMi5qcwbCwIGnZGVmYXVsdJWhbKdjb3VudEJ5F8DA3AAZl6FvAAADwJEQwJmhZAkAAsCRAsDCmaFpr2Jhc2VBc3NpZ25WYWx1ZZICFcAAp2RlZmF1bHTAwMCYoXILD8DAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmwY3JlYXRlQWdncmVnYXRvcpIFE8ABp2RlZmF1bHTAwMCYoXILEMDAkQTAwpyhaQEWBAeQwMIBwsDAl6FvAQAIFpDAmKFnAAEJC5DAwpmhZAQTCsCSCgjAwpmhbKtvYmplY3RQcm90b5IKDsDAwAiQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY291bnRCeS5qc5ihcgALwMCRCcDCmKFnAQEMD5DAwpmhZAQPDcCUDg0LCcDCmaFsr2hhc093blByb3BlcnR5MJINFMDAwAuQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY291bnRCeS5qc5ihcgAPwA6RDMDCmKFyAwvAwJEJwMKYoWcBARDAkMDCmaFkBAARwJQRDxIMwMKZoWynY291bnRCeZIRGMDAwA+Q2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY291bnRCeS5qc5ihcgAHwBKREMDCmKFnAxgTwJMTFBXAwpihcgAQwBSRBMDCmKFyJw/AFZEMwMKYoXI4D8DAkQHAwpihZwEDF8CQwMKYoWcJCxjAkRjAwpihcgAHwMCREMDC
====catalogjs annotation end====*/