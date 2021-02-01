import { default as baseClone } from "./dist/40.js";
var CLONE_SYMBOLS_FLAG = 4;
function cloneWith(value, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
}
export { cloneWith as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvNDAuanMDwsCBp2RlZmF1bHSUoWypY2xvbmVXaXRoDcCfl6FvAAADwJDAmaFkCQACwJECwMKYoWmpYmFzZUNsb25lkgIKwACnZGVmYXVsdMDAmKFyCwnAwJEBwMKcoWkAFwEEkMDCAMLAwJehbwEABQyQwJihZwABBgiQwMKZoWQEBAfAkgcFwMKYoWyyQ0xPTkVfU1lNQk9MU19GTEFHkgcLwMDABdlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2Nsb25lV2l0aC5qc5ihcgASwMCRBsDCmaFkARAJwJQKCwkGwMKYoWypY2xvbmVXaXRokgkOwMDAwNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2Nsb25lV2l0aC5qc5ihcgkJwAqRCMDCmKFyaAnAC5EBwMKYoXIIEsDAkQbAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAJwMCRCMDC
====catalogjs annotation end====*/