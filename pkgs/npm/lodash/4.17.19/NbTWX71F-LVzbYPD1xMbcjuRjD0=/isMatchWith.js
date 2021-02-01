import { default as baseIsMatch } from "./dist/42.js";
import { default as getMatchData } from "./dist/72.js";
function isMatchWith(object, source, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return baseIsMatch(object, source, getMatchData(source), customizer);
}
export { isMatchWith as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNDIuanMDwsCVwqwuL2Rpc3QvNzIuanMGwsCBp2RlZmF1bHSUoWyraXNNYXRjaFdpdGgNwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpihaatiYXNlSXNNYXRjaJICCsAAp2RlZmF1bHTAwJihcgsLwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaxnZXRNYXRjaERhdGGSBQvAAadkZWZhdWx0wMCYoXILDMDAkQTAwpyhaQEXBAeQwMIBwsDAl6FvAQAIDJDAmaFkABgJwJMKCwnAwpihbKtpc01hdGNoV2l0aJIJDsDAwMDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc01hdGNoV2l0aC5qc5ihcgkLwAqRCMDCmKFycQvAC5EBwMKYoXIRDMDAkQTAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgALwMCRCMDC
====catalogjs annotation end====*/