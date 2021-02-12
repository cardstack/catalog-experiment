import { default as baseExtremum } from "./dist/28.js";
import { default as baseLt } from "./dist/166.js";
import { default as identity } from "./identity.js";
function min(array) {
  return array && array.length ? baseExtremum(array, identity, baseLt) : undefined;
}
export { min as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvMjguanMDwsCVwq0uL2Rpc3QvMTY2LmpzBsLAlcKtLi9pZGVudGl0eS5qcwnCwIGnZGVmYXVsdJWhbKNtaW4RwMDcABOXoW8AAAPAkMCZoWQJAALAkQLAwpmhaaxiYXNlRXh0cmVtdW2SAg3AAKdkZWZhdWx0wMDAmKFyCwzAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFppmJhc2VMdJIFD8ABp2RlZmF1bHTAwMCYoXILBsDAkQTAwpyhaQEYBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmoaWRlbnRpdHmSCA7AAqdkZWZhdWx0wMDAmKFyCwjAwJEHwMKcoWkBGAcKkMDCAsLAwJehbwEACxCQwJmhZAAQDMCUDQ4PDMDCmaFso21pbpIMEsDAwMCQ2UNXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbWluLmpzmKFyCQPADZELwMKYoXIrDMAOkQHAwpihcggIwA+RB8DCmKFyAgbAwJEEwMKYoWcBAxHAkMDCmKFnCQsSwJESwMKYoXIAA8DAkQvAwg==
====catalogjs annotation end====*/