import { default as baseUniq } from "./dist/63.js";
function uniqWith(array, comparator) {
  comparator = typeof comparator == 'function' ? comparator : undefined;
  return array && array.length ? baseUniq(array, undefined, comparator) : [];
}
export { uniqWith as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvNjMuanMDwsCBp2RlZmF1bHSUoWyodW5pcVdpdGgJwJuXoW8AAAPAkQXAmaFkCQACwJECwMKYoWmoYmFzZVVuaXGSAgfAAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAXAQSQwMIAwsDAl6FvAQAFCJDAmaFkACYGwJIHBsDCmKFsqHVuaXFXaXRokgYKwMDAwNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3VuaXFXaXRoLmpzmKFyCQjAB5EFwMKYoXLMgAjAwJEBwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIACMDAkQXAwg==
====catalogjs annotation end====*/