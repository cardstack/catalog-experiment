import { default as apply } from "./dist/111.js";
import { default as arrayPush } from "./dist/139.js";
import { default as baseRest } from "./dist/49.js";
import { default as castSlice } from "./dist/140.js";
import { default as toInteger } from "./toInteger.js";
var FUNC_ERROR_TEXT = 'Expected a function';
var nativeMax = Math.max;
function spread(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  start = start == null ? 0 : nativeMax(toInteger(start), 0);
  return baseRest(function (args) {
    var array = args[start],
        otherArgs = castSlice(args, 0, start);

    if (array) {
      arrayPush(otherArgs, array);
    }

    return apply(func, this, otherArgs);
  });
}
export { spread as default };
/*====catalogjs annotation start====
k5WVwq0uL2Rpc3QvMTExLmpzA8LAlcKtLi9kaXN0LzEzOS5qcwfCwJXCrC4vZGlzdC80OS5qcwvCwJXCrS4vZGlzdC8xNDAuanMPwsCVwq4uL3RvSW50ZWdlci5qcxPCwIGnZGVmYXVsdJWhbKZzcHJlYWQmwMDcACiXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaaVhcHBseZICJMAAp2RlZmF1bHTAwMCYoXILBcDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgPwMCQwMKZoWQJAAYIkQbAwpmhaalhcnJheVB1c2iSBiPAAadkZWZhdWx0wMDAmKFyCwnAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcID8DAkMDCmaFkCQAKDJEKwMKZoWmoYmFzZVJlc3SSCiHAAqdkZWZhdWx0wMDAmKFyCwjAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIDsDAkMDCmaFkCQAOEJEOwMKZoWmpY2FzdFNsaWNlkg4iwAOnZGVmYXVsdMDAwJihcgsJwMCRDcDCnKFpAQENE5EQwMIDwsDAmKFnCA/AwJDAwpmhZAkAEhSREsDCmaFpqXRvSW50ZWdlcpISIMAEp2RlZmF1bHTAwMCYoXILCcDAkRHAwpyhaQEBERWRFMDCBMLAwJihZwgQwMCQwMKXoW8BABYlkMCYoWcAARcZkMDCmaFkBBgYwJIYFsDCmaFsr0ZVTkNfRVJST1JfVEVYVJIYHsDAwBaQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc3ByZWFkLmpzmKFyAA/AwJEXwMKYoWcBARockMDCmaFkBAsbwJIbGcDCmaFsqW5hdGl2ZU1heJIbH8DAwBmQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc3ByZWFkLmpzmKFyAAnAwJEawMKZoWQBIB3Amh4fICEiIyQdFxrAwpmhbKZzcHJlYWSSHSfAwMDAkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL3NwcmVhZC5qc5ihcgkGwB6RHMDCmKFySw/AH5EXwMKYoXImCcAgkRrAwpihcgEJwCGREcDCmKFyFgjAIpEJwMKYoXJECcAjkQ3AwpihcioJwCSRBcDCmKFyJgXAwJEBwMKYoWcBAybAkMDCmKFnCQsnwJEnwMKYoXIABsDAkRzAwg==
====catalogjs annotation end====*/