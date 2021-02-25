import { default as lodash } from "./wrapperLodash.js";
function chain(value) {
  var result = lodash(value);
  result.__chain__ = true;
  return result;
}
export { chain as default };
/*====catalogjs annotation start====
k5GVwrIuL3dyYXBwZXJMb2Rhc2guanMDwsCBp2RlZmF1bHSVoWylY2hhaW4KwMCcl6FvAAADwJDAmaFkCQACBJECwMKZoWmmbG9kYXNokgIIwACnZGVmYXVsdMDAwJihcgsGwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCBTAwJDAwpehbwEABgmQwJmhZAA2B8CSCAfAwpmhbKVjaGFpbpIHC8DAwMCQ2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY2hhaW4uanOYoXIJBcAIkQbAwpihchkGwMCRAcDCmKFnAQMKwJDAwpihZwkLC8CRC8DCmKFyAAXAwJEGwMI=
====catalogjs annotation end====*/