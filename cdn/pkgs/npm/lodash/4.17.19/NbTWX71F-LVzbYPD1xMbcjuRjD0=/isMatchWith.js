import { default as baseIsMatch } from "./dist/42.js";
import { default as getMatchData } from "./dist/72.js";
function isMatchWith(object, source, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return baseIsMatch(object, source, getMatchData(source), customizer);
}
export { isMatchWith as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNDIuanMDwsCVwqwuL2Rpc3QvNzIuanMHwsCBp2RlZmF1bHSVoWyraXNNYXRjaFdpdGgPwMDcABGXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaatiYXNlSXNNYXRjaJICDMAAp2RlZmF1bHTAwMCYoXILC8DAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaaxnZXRNYXRjaERhdGGSBg3AAadkZWZhdWx0wMDAmKFyCwzAwJEFwMKcoWkBAQUJkQjAwgHCwMCYoWcIDsDAkMDCl6FvAQAKDpDAmaFkABgLwJMMDQvAwpmhbKtpc01hdGNoV2l0aJILEMDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNNYXRjaFdpdGguanOYoXIJC8AMkQrAwpihcnELwA2RAcDCmKFyEQzAwJEFwMKYoWcBAw/AkMDCmKFnCQsQwJEQwMKYoXIAC8DAkQrAwg==
====catalogjs annotation end====*/