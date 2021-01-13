import { default as root } from "./dist/93.js";
var nativeIsFinite = root.isFinite;
function isFinite(value) {
  return typeof value == 'number' && nativeIsFinite(value);
}
export { isFinite as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvOTMuanMDwsCBp2RlZmF1bHSUoWyoaXNGaW5pdGUNwJ+XoW8AAAPAkQnAmaFkCQACwJECwMKYoWmkcm9vdJICCMAAp2RlZmF1bHTAwJihcgsEwMCRAcDCnKFpABcBBJDAwgDCwMCXoW8BAAUMkMCYoWcAAQYJkMDCmaFkBAkHwJMIBwXAwpihbK5uYXRpdmVJc0Zpbml0ZZIHC8DAwAXZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9pc0Zpbml0ZS5qc5ihcgAOwAiRBsDCmKFyAwTAwJEBwMKZoWQBCgrAkwsKBsDCmKFsqGlzRmluaXRlkgoOwMDAwNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzRmluaXRlLmpzmKFyCQjAC5EJwMKYoXIvDsDAkQbAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAIwMCRCcDC
====catalogjs annotation end====*/