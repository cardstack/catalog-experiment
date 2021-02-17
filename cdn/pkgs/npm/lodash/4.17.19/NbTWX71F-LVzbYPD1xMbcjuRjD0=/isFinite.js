import { default as root } from "./dist/93.js";
var nativeIsFinite = root.isFinite;
function isFinite0(value) {
  return typeof value == 'number' && nativeIsFinite(value);
}
export { isFinite0 as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvOTMuanMDwsCBp2RlZmF1bHSVoWypaXNGaW5pdGUwDsDA3AAQl6FvAAADwJDAmaFkCQACBJECwMKZoWmkcm9vdJICCcAAp2RlZmF1bHTAwMCYoXILBMDAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgOwMCQwMKXoW8BAAYNkMCYoWcAAQcKkMDCmaFkBAkIwJMJCAbAwpmhbK5uYXRpdmVJc0Zpbml0ZZIIDMDAwAaQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNGaW5pdGUuanOYoXIADsAJkQfAwpihcgMEwMCRAcDCmaFkAQoLwJMMCwfAwpmhbKlpc0Zpbml0ZTCSCw/AwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzRmluaXRlLmpzmKFyCQnADJEKwMKYoXIvDsDAkQfAwpihZwEDDsCQwMKYoWcJCw/AkQ/AwpihcgAJwMCRCsDC
====catalogjs annotation end====*/