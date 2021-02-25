import { default as baseClamp } from "./dist/148.js";
import { default as toNumber } from "./toNumber.js";
function clamp(number, lower, upper) {
  if (upper === undefined) {
    upper = lower;
    lower = undefined;
  }

  if (upper !== undefined) {
    upper = toNumber(upper);
    upper = upper === upper ? upper : 0;
  }

  if (lower !== undefined) {
    lower = toNumber(lower);
    lower = lower === lower ? lower : 0;
  }

  return baseClamp(toNumber(number), lower, upper);
}
export { clamp as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTQ4LmpzA8LAlcKtLi90b051bWJlci5qcwfCwIGnZGVmYXVsdJWhbKVjbGFtcBHAwNwAE5ehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqWJhc2VDbGFtcJICDsAAp2RlZmF1bHTAwMCYoXILCcDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgPwMCQwMKZoWQJAAYIkQbAwpmhaah0b051bWJlcpQGDA0PwAGnZGVmYXVsdMDAwJihcgsIwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCA/AwJDAwpehbwEAChCQwJmhZAAaC8CVDA0ODwvAwpmhbKVjbGFtcJILEsDAwMCQ2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY2xhbXAuanOYoXIJBcAMkQrAwpihcsyOCMANkQXAwpihcmAIwA6RBcDCmKFyQAnAD5EBwMKYoXIBCMDAkQXAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAFwMCRCsDC
====catalogjs annotation end====*/