import { default as baseFunctions } from "./dist/83.js";
import { default as keys } from "./keys.js";
function functions(object) {
  return object == null ? [] : baseFunctions(object, keys(object));
}
export { functions as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvODMuanMDwsCVwqkuL2tleXMuanMHwsCBp2RlZmF1bHSVoWypZnVuY3Rpb25zD8DA3AARl6FvAAADwJDAmaFkCQACBJECwMKZoWmtYmFzZUZ1bmN0aW9uc5ICDMAAp2RlZmF1bHTAwMCYoXILDcDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaaRrZXlzkgYNwAGnZGVmYXVsdMDAwJihcgsEwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCAvAwJDAwpehbwEACg6QwJmhZAAMC8CTDA0LwMKZoWypZnVuY3Rpb25zkgsQwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9mdW5jdGlvbnMuanOYoXIJCcAMkQrAwpihcioNwA2RAcDCmKFyCQTAwJEFwMKYoWcBAw/AkMDCmKFnCQsQwJEQwMKYoXIACcDAkQrAwg==
====catalogjs annotation end====*/