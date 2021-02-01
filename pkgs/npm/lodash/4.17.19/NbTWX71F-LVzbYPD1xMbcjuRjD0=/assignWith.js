import { default as copyObject } from "./dist/54.js";
import { default as createAssigner } from "./dist/48.js";
import { default as keys } from "./keys.js";
var assignWith = createAssigner(function (object, source, srcIndex, customizer) {
  copyObject(source, keys(source), object, customizer);
});
export { assignWith as default };
/*====catalogjs annotation start====
k5OVwqwuL2Rpc3QvNTQuanMDwsCVwqwuL2Rpc3QvNDguanMGwsCVwqkuL2tleXMuanMJwsCBp2RlZmF1bHSUoWyqYXNzaWduV2l0aBPA3AAVl6FvAAADwJEMwJmhZAkAAsCRAsDCmKFpqmNvcHlPYmplY3SSAhDAAKdkZWZhdWx0wMCYoXILCsDAkQHAwpyhaQAXAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmuY3JlYXRlQXNzaWduZXKSBQ/AAadkZWZhdWx0wMCYoXILDsDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmka2V5c5IIEcACp2RlZmF1bHTAwJihcgsEwMCRB8DCnKFpARQHCpDAwgLCwMCXoW8BAAsSkMCYoWcAAQzAkMDCmaFkBAANwJMNCw7AwpihbKphc3NpZ25XaXRokg0UwMDAC9lKV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2Fzc2lnbldpdGguanOYoXIACsAOkQzAwpihZwMhD8CTDxARwMKYoXIADsAQkQTAwpihcjUKwBGRAcDCmKFyCQTAwJEHwMKYoWcBAxPAkMDCmKFnCQsUwJEUwMKYoXIACsDAkQzAwg==
====catalogjs annotation end====*/