import { default as get } from "../get.js";
function baseAt(object, paths) {
  var index = -1,
      length = paths.length,
      result = Array(length),
      skip = object == null;

  while (++index < length) {
    result[index] = skip ? undefined : get(object, paths[index]);
  }

  return result;
}
export { baseAt as default };
/*====catalogjs annotation start====
k5GVwqkuLi9nZXQuanMDwsCBp2RlZmF1bHSVoWymYmFzZUF0CcDAm5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFpo2dldJICB8AAp2RlZmF1bHTAwMCYoXILA8DAkQHAwpyhaQAUAQSQwMIAwsDAl6FvAQAFCJDAmaFkAC8GwJIHBsDCmaFspmJhc2VBdJIGCsDAwMCQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VBdC5qc5ihcgkGwAeRBcDCmKFyzMEDwMCRAcDCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyAAbAwJEFwMI=
====catalogjs annotation end====*/