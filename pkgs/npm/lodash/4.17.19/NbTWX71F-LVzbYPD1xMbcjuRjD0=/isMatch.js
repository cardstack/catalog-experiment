import { default as baseIsMatch } from "./dist/42.js";
import { default as getMatchData } from "./dist/72.js";
function isMatch(object, source) {
  return object === source || baseIsMatch(object, source, getMatchData(source));
}
export { isMatch as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNDIuanMDwsCVwqwuL2Rpc3QvNzIuanMGwsCBp2RlZmF1bHSUoWynaXNNYXRjaA3An5ehbwAAA8CQwJmhZAkAAsCRAsDCmKFpq2Jhc2VJc01hdGNokgIKwACnZGVmYXVsdMDAmKFyCwvAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFprGdldE1hdGNoRGF0YZIFC8ABp2RlZmF1bHTAwJihcgsMwMCRBMDCnKFpARcEB5DAwgHCwMCXoW8BAAgMkMCZoWQADAnAkwoLCcDCmKFsp2lzTWF0Y2iSCQ7AwMDA2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNNYXRjaC5qc5ihcgkHwAqRCMDCmKFyMQvAC5EBwMKYoXIRDMDAkQTAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAHwMCRCMDC
====catalogjs annotation end====*/