import { default as baseIsMatch } from "./dist/42.js";
import { default as getMatchData } from "./dist/72.js";
function isMatchWith(object, source, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return baseIsMatch(object, source, getMatchData(source), customizer);
}
export { isMatchWith as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNDIuanMDwsCVwqwuL2Rpc3QvNzIuanMGwsCBp2RlZmF1bHSVoWyraXNNYXRjaFdpdGgNwMCfl6FvAAADwJDAmaFkCQACwJECwMKZoWmrYmFzZUlzTWF0Y2iSAgrAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmaFprGdldE1hdGNoRGF0YZIFC8ABp2RlZmF1bHTAwMCYoXILDMDAkQTAwpyhaQEXBAeQwMIBwsDAl6FvAQAIDJDAmaFkABgJwJMKCwnAwpmhbKtpc01hdGNoV2l0aJIJDsDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNNYXRjaFdpdGguanOYoXIJC8AKkQjAwpihcnELwAuRAcDCmKFyEQzAwJEEwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIAC8DAkQjAwg==
====catalogjs annotation end====*/