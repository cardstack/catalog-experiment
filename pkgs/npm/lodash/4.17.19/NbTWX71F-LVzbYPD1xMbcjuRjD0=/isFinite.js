import { default as root } from "./dist/93.js";
var nativeIsFinite = root.isFinite;
function isFinite(value) {
  return typeof value == 'number' && nativeIsFinite(value);
}
export { isFinite as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvOTMuanMDwsCBp2RlZmF1bHSUoWyoaXNGaW5pdGUNwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpihaaRyb290kgIIwACnZGVmYXVsdMDAmKFyCwTAwJEBwMKcoWkAFwEEkMDCAMLAwJehbwEABQyQwJihZwABBgmQwMKZoWQECQfAkwgHBcDCmKFsrm5hdGl2ZUlzRmluaXRlkgcLwMDABdlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2lzRmluaXRlLmpzmKFyAA7ACJEGwMKYoXIDBMDAkQHAwpmhZAEKCsCTCwoGwMKYoWyoaXNGaW5pdGWSCg7AwMDA2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNGaW5pdGUuanOYoXIJCMALkQnAwpihci8OwMCRBsDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAjAwJEJwMI=
====catalogjs annotation end====*/