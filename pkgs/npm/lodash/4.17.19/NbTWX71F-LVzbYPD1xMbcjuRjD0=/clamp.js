import { default as baseClamp } from "./dist/148.js";
import { default as toNumber } from "./toNumber.js";
function clamp(number, lower, upper) {
  if (upper === undefined) {
    upper = lower;
    lower = undefined;
  }

  if (upper !== undefined) {
    upper = toNumber(upper);
    upper = upper === upper ? upper : 0;
  }

  if (lower !== undefined) {
    lower = toNumber(lower);
    lower = lower === lower ? lower : 0;
  }

  return baseClamp(toNumber(number), lower, upper);
}
export { clamp as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTQ4LmpzA8LAlcKtLi90b051bWJlci5qcwbCwIGnZGVmYXVsdJShbKVjbGFtcA/A3AARl6FvAAADwJDAmaFkCQACwJECwMKYoWmpYmFzZUNsYW1wkgIMwACnZGVmYXVsdMDAmKFyCwnAwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqHRvTnVtYmVylAUKCw3AAadkZWZhdWx0wMCYoXILCMDAkQTAwpyhaQEYBAeQwMIBwsDAl6FvAQAIDpDAmaFkABoJwJUKCwwNCcDCmKFspWNsYW1wkgkQwMDAwNlFV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2NsYW1wLmpzmKFyCQXACpEIwMKYoXLMjgjAC5EEwMKYoXJgCMAMkQTAwpihckAJwA2RAcDCmKFyAQjAwJEEwMKYoWcBAw/AkMDCmKFnCQsQwJEQwMKYoXIABcDAkQjAwg==
====catalogjs annotation end====*/