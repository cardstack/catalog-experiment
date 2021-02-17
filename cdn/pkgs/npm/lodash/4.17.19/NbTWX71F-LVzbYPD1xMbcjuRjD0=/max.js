import { default as baseExtremum } from "./dist/28.js";
import { default as baseGt } from "./dist/165.js";
import { default as identity } from "./identity.js";
function max(array) {
  return array && array.length ? baseExtremum(array, identity, baseGt) : undefined;
}
export { max as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMjguanMDwsCVwq0uL2Rpc3QvMTY1LmpzB8LAlcKtLi9pZGVudGl0eS5qcwvCwIGnZGVmYXVsdJWhbKNtYXgUwMDcABaXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaaxiYXNlRXh0cmVtdW2SAhDAAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmmYmFzZUd0kgYSwAGnZGVmYXVsdMDAwJihcgsGwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA/AwJDAwpmhZAkACgyRCsDCmaFpqGlkZW50aXR5kgoRwAKnZGVmYXVsdMDAwJihcgsIwMCRCcDCnKFpAQEJDZEMwMICwsDAmKFnCA/AwJDAwpehbwEADhOQwJmhZAAQD8CUEBESD8DCmaFso21heJIPFcDAwMCQ2UNXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbWF4LmpzmKFyCQPAEJEOwMKYoXIrDMARkQHAwpihcggIwBKRCcDCmKFyAgbAwJEFwMKYoWcBAxTAkMDCmKFnCQsVwJEVwMKYoXIAA8DAkQ7Awg==
====catalogjs annotation end====*/