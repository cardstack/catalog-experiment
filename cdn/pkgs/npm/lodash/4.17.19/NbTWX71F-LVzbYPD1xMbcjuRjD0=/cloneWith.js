import { default as baseClone } from "./dist/40.js";
var CLONE_SYMBOLS_FLAG = 4;
function cloneWith(value, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
}
export { cloneWith as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvNDAuanMDwsCBp2RlZmF1bHSVoWypY2xvbmVXaXRoDsDA3AAQl6FvAAADwJDAmaFkCQACBJECwMKZoWmpYmFzZUNsb25lkgILwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCA7AwJDAwpehbwEABg2QwJihZwABBwmQwMKZoWQEBAjAkggGwMKZoWyyQ0xPTkVfU1lNQk9MU19GTEFHkggMwMDABpDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jbG9uZVdpdGguanOYoXIAEsDAkQfAwpmhZAEQCsCUCwwKB8DCmaFsqWNsb25lV2l0aJIKD8DAwMCQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY2xvbmVXaXRoLmpzmKFyCQnAC5EJwMKYoXJoCcAMkQHAwpihcggSwMCRB8DCmKFnAQMOwJDAwpihZwkLD8CRD8DCmKFyAAnAwJEJwMI=
====catalogjs annotation end====*/