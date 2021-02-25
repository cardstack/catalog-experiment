import { default as baseValues } from "./dist/96.js";
import { default as keys } from "./keys.js";
function values(object) {
  return object == null ? [] : baseValues(object, keys(object));
}
export { values as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvOTYuanMDwsCVwqkuL2tleXMuanMHwsCBp2RlZmF1bHSVoWymdmFsdWVzD8DA3AARl6FvAAADwJDAmaFkCQACBJECwMKZoWmqYmFzZVZhbHVlc5ICDMAAp2RlZmF1bHTAwMCYoXILCsDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaaRrZXlzkgYNwAGnZGVmYXVsdMDAwJihcgsEwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCAvAwJDAwpehbwEACg6QwJmhZAAMC8CTDA0LwMKZoWymdmFsdWVzkgsQwMDAwJDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy92YWx1ZXMuanOYoXIJBsAMkQrAwpihcioKwA2RAcDCmKFyCQTAwJEFwMKYoWcBAw/AkMDCmKFnCQsQwJEQwMKYoXIABsDAkQrAwg==
====catalogjs annotation end====*/