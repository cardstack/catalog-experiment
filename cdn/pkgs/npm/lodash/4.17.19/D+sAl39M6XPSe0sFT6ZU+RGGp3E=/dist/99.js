import { default as arrayPush } from "./139.js";
import { default as isArray } from "../isArray.js";
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}
export { baseGetAllKeys as default };
/*====catalogjs annotation start====
k5KVwqguLzEzOS5qcwPCwJXCrS4uL2lzQXJyYXkuanMHwsCBp2RlZmF1bHSVoWyuYmFzZUdldEFsbEtleXMPwMDcABGXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaalhcnJheVB1c2iSAg3AAKdkZWZhdWx0wMDAmKFyCwnAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcICsDAkMDCmaFkCQAGCJEGwMKZoWmnaXNBcnJheZIGDMABp2RlZmF1bHTAwMCYoXILB8DAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgPwMCQwMKXoW8BAAoOkMCZoWQAIAvAkwwNC8DCmaFsrmJhc2VHZXRBbGxLZXlzkgsQwMDAwJDZT1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUdldEFsbEtleXMuanOYoXIJDsAMkQrAwpihckwHwA2RBcDCmKFyFAnAwJEBwMKYoWcBAw/AkMDCmKFnCQsQwJEQwMKYoXIADsDAkQrAwg==
====catalogjs annotation end====*/