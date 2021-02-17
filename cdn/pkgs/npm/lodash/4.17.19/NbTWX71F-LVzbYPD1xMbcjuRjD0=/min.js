import { default as baseExtremum } from "./dist/28.js";
import { default as baseLt } from "./dist/166.js";
import { default as identity } from "./identity.js";
function min(array) {
  return array && array.length ? baseExtremum(array, identity, baseLt) : undefined;
}
export { min as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMjguanMDwsCVwq0uL2Rpc3QvMTY2LmpzB8LAlcKtLi9pZGVudGl0eS5qcwvCwIGnZGVmYXVsdJWhbKNtaW4UwMDcABaXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaaxiYXNlRXh0cmVtdW2SAhDAAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmmYmFzZUx0kgYSwAGnZGVmYXVsdMDAwJihcgsGwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCA/AwJDAwpmhZAkACgyRCsDCmaFpqGlkZW50aXR5kgoRwAKnZGVmYXVsdMDAwJihcgsIwMCRCcDCnKFpAQEJDZEMwMICwsDAmKFnCA/AwJDAwpehbwEADhOQwJmhZAAQD8CUEBESD8DCmaFso21pbpIPFcDAwMCQ2UNXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbWluLmpzmKFyCQPAEJEOwMKYoXIrDMARkQHAwpihcggIwBKRCcDCmKFyAgbAwJEFwMKYoWcBAxTAkMDCmKFnCQsVwJEVwMKYoXIAA8DAkQ7Awg==
====catalogjs annotation end====*/