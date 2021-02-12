import { default as baseClone } from "./dist/40.js";
var CLONE_DEEP_FLAG = 1,
    CLONE_SYMBOLS_FLAG = 4;
function cloneDeep(value) {
  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
}
export { cloneDeep as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvNDAuanMDwsCBp2RlZmF1bHSVoWypY2xvbmVEZWVwEMDA3AASl6FvAAADwJDAmaFkCQACwJECwMKZoWmpYmFzZUNsb25lkgIMwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpABcBBJDAwgDCwMCXoW8BAAUPkMCYoWcAAQYKkMDCmaFkBAQHCJIHBcDCmaFsr0NMT05FX0RFRVBfRkxBR5IHDcDAwAWQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY2xvbmVEZWVwLmpzmKFyAA/AwJEGwMKZoWQGBAnAkgkFwMKZoWyyQ0xPTkVfU1lNQk9MU19GTEFHkgkOwMDABZDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jbG9uZURlZXAuanOYoXIAEsDAkQjAwpmhZAEEC8CWDA0OCwYIwMKZoWypY2xvbmVEZWVwkgsRwMDAwJDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9jbG9uZURlZXAuanOYoXIJCcAMkQrAwpihchMJwA2RAcDCmKFyCA/ADpEGwMKYoXIDEsDAkQjAwpihZwEDEMCQwMKYoWcJCxHAkRHAwpihcgAJwMCRCsDC
====catalogjs annotation end====*/