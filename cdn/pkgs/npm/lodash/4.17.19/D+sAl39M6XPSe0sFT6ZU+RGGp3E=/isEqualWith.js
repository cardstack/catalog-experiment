import { default as baseIsEqual } from "./dist/43.js";
function isEqualWith(value, other, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  var result = customizer ? customizer(value, other) : undefined;
  return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
}
export { isEqualWith as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvNDMuanMDwsCBp2RlZmF1bHSVoWyraXNFcXVhbFdpdGgKwMCcl6FvAAADwJDAmaFkCQACBJECwMKZoWmrYmFzZUlzRXF1YWySAgjAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAAQEFkQTAwgDCwMCYoWcIDsDAkMDCl6FvAQAGCZDAmaFkADMHwJIIB8DCmaFsq2lzRXF1YWxXaXRokgcLwMDAwJDZS1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0VxdWFsV2l0aC5qc5ihcgkLwAiRBsDCmKFyzMgLwMCRAcDCmKFnAQMKwJDAwpihZwkLC8CRC8DCmKFyAAvAwJEGwMI=
====catalogjs annotation end====*/