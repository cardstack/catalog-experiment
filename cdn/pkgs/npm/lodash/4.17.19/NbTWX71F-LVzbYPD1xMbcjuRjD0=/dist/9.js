import { default as baseUnset } from "./10.js";
import { default as isIndex } from "./128.js";
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function basePullAt(array, indexes) {
  var length = array ? indexes.length : 0,
      lastIndex = length - 1;

  while (length--) {
    var index = indexes[length];

    if (length == lastIndex || index !== previous) {
      var previous = index;

      if (isIndex(index)) {
        splice.call(array, index, 1);
      } else {
        baseUnset(array, index);
      }
    }
  }

  return array;
}
export { basePullAt as default };
/*====catalogjs annotation start====
k5KVwqcuLzEwLmpzA8LAlcKoLi8xMjguanMGwsCBp2RlZmF1bHSVoWyqYmFzZVB1bGxBdBXAwNwAF5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqWJhc2VVbnNldJICE8AAp2RlZmF1bHTAwMCYoXILCcDAkQHAwpyhaQASAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmnaXNJbmRleJIFEcABp2RlZmF1bHTAwMCYoXILB8DAkQTAwpyhaQETBAeQwMIBwsDAl6FvAQAIFJDAmKFnAAEJC5DAwpmhZAQSCsCSCgjAwpmhbKphcnJheVByb3RvkgoOwMDACJDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVB1bGxBdC5qc5ihcgAKwMCRCcDCmKFnAQEMD5DAwpmhZAQHDcCUDg0LCcDCmaFspnNwbGljZZINEsDAwAuQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VQdWxsQXQuanOYoXIABsAOkQzAwpihcgMKwMCRCcDCmaFkATQQwJUREhMQDMDCmaFsqmJhc2VQdWxsQXSSEBbAwMDAkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlUHVsbEF0LmpzmKFyCQrAEZEPwMKYoXLM8AfAEpEEwMKYoXITBsATkQzAwpihci8JwMCRAcDCmKFnAQMVwJDAwpihZwkLFsCRFsDCmKFyAArAwJEPwMI=
====catalogjs annotation end====*/