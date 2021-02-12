import { default as baseExtremum } from "./dist/28.js";
import { default as baseGt } from "./dist/165.js";
import { default as identity } from "./identity.js";
function max(array) {
  return array && array.length ? baseExtremum(array, identity, baseGt) : undefined;
}
export { max as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMjguanMDwsCVwq0uL2Rpc3QvMTY1LmpzBsLAlcKtLi9pZGVudGl0eS5qcwnCwIGnZGVmYXVsdJWhbKNtYXgRwMDcABOXoW8AAAPAkMCZoWQJAALAkQLAwpmhaaxiYXNlRXh0cmVtdW2SAg3AAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFppmJhc2VHdJIFD8ABp2RlZmF1bHTAwMCYoXILBsDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmoaWRlbnRpdHmSCA7AAqdkZWZhdWx0wMDAmKFyCwjAwJEHwMKcoWkBGAcKkMDCAsLAwJehbwEACxCQwJmhZAAQDMCUDQ4PDMDCmaFso21heJIMEsDAwMCQ2UNXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbWF4LmpzmKFyCQPADZELwMKYoXIrDMAOkQHAwpihcggIwA+RB8DCmKFyAgbAwJEEwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIAA8DAkQvAwg==
====catalogjs annotation end====*/