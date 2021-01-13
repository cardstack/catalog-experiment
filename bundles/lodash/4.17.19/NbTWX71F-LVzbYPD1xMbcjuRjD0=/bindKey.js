import { default as baseRest } from "./dist/49.js";
import { default as createWrap } from "./dist/23.js";
import { default as getHolder } from "./dist/126.js";
import { default as replaceHolders } from "./dist/129.js";
var WRAP_BIND_FLAG = 1,
    WRAP_BIND_KEY_FLAG = 2,
    WRAP_PARTIAL_FLAG = 32;
var bindKey = baseRest(function (object, key, partials) {
  var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;

  if (partials.length) {
    var holders = replaceHolders(partials, getHolder(bindKey));
    bitmask |= WRAP_PARTIAL_FLAG;
  }

  return createWrap(key, bitmask, object, partials, holders);
});
bindKey.placeholder = {};
export { bindKey as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvNDkuanMDwsCVwqwuL2Rpc3QvMjMuanMGwsCVwq0uL2Rpc3QvMTI2LmpzCcLAlcKtLi9kaXN0LzEyOS5qcwzCwIGnZGVmYXVsdJShbKdiaW5kS2V5JMDcACaXoW8AAAPAkhYhwJmhZAkAAsCRAsDCmKFpqGJhc2VSZXN0kgIZwACnZGVmYXVsdMDAmKFyCwjAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFpqmNyZWF0ZVdyYXCSBSDAAadkZWZhdWx0wMCYoXILCsDAkQTAwpyhaQEXBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmpZ2V0SG9sZGVykggdwAKnZGVmYXVsdMDAmKFyCwnAwJEHwMKcoWkBGAcMkMDCAsLAwJmhZAkAC8CRC8DCmKFprnJlcGxhY2VIb2xkZXJzkgscwAOnZGVmYXVsdMDAmKFyCw7AwJEKwMKcoWkBGAoNkMDCA8LAwJehbwEADiOQwJihZwABDxWQwMKZoWQEBBARkxAOIcDCmKFsrldSQVBfQklORF9GTEFHkhAawMDADtlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2JpbmRLZXkuanOYoXIADsDAkQ/AwpmhZAYEEhOTEg4hwMKYoWyyV1JBUF9CSU5EX0tFWV9GTEFHkhIbwMDADtlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2JpbmRLZXkuanOYoXIAEsDAkRHAwpmhZAYFFMCTFA4hwMKYoWyxV1JBUF9QQVJUSUFMX0ZMQUeSFB/AwMAO2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvYmluZEtleS5qc5ihcgARwMCRE8DCmKFnAQEWIZDAwpmhZAQAF8CXFxUYDxETIcDCmKFsp2JpbmRLZXmUFx4iJcDAwBXZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9iaW5kS2V5LmpzmKFyAAfAGJEWwMKYoWcDLRnAmRkaGxwdHh8gFsDCmKFyAAjAGpEBwMKYoXI0DsAbkQ/AwpihcgMSwByREcDCmKFyLg7AHZEKwMKYoXILCcAekQfAwpihcgEHwB+RFsDCmKFyExHAIJETwMKYoXIQCsDAkQTAwpihZwESIsCRIsDDmKFyAAfAwJEWwMKYoWcBAyTAkMDCmKFnCQslwJElwMKYoXIAB8DAkRbAwg==
====catalogjs annotation end====*/