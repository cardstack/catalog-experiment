import { default as baseSet } from "./dist/16.js";
function setWith(object, path, value, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return object == null ? object : baseSet(object, path, value, customizer);
}
export { setWith as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTYuanMDwsCBp2RlZmF1bHSUoWync2V0V2l0aAnAm5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpp2Jhc2VTZXSSAgfAAKdkZWZhdWx0wMCYoXILB8DAkQHAwpyhaQAXAQSQwMIAwsDAl6FvAQAFCJDAmaFkACQGwJIHBsDCmKFsp3NldFdpdGiSBgrAwMDA2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc2V0V2l0aC5qc5ihcgkHwAeRBcDCmKFyzJAHwMCRAcDCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyAAfAwJEFwMI=
====catalogjs annotation end====*/