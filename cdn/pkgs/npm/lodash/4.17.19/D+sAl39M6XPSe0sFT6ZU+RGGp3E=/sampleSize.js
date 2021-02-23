import { default as baseClamp } from "./dist/148.js";
import { default as copyArray } from "./dist/117.js";
import { default as shuffleSelf } from "./dist/170.js";
import { default as values } from "./values.js";
import { default as isArray } from "./isArray.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as toInteger } from "./toInteger.js";
function arraySampleSize(array, n) {
  return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
}
function baseSampleSize(collection, n) {
  var array = values(collection);
  return shuffleSelf(array, baseClamp(n, 0, array.length));
}
function sampleSize(collection, n, guard) {
  if (guard ? isIterateeCall(collection, n, guard) : n === undefined) {
    n = 1;
  } else {
    n = toInteger(n);
  }

  var func = isArray(collection) ? arraySampleSize : baseSampleSize;
  return func(collection, n);
}
export { sampleSize as default };
/*====catalogjs annotation start====
k5eVwq0uL2Rpc3QvMTQ4LmpzA8LAlcKtLi9kaXN0LzExNy5qcwfCwJXCrS4vZGlzdC8xNzAuanMLwsCVwqsuL3ZhbHVlcy5qcw/CwJXCrC4vaXNBcnJheS5qcxPCwJXCrC4vZGlzdC83MC5qcxfCwJXCri4vdG9JbnRlZ2VyLmpzG8LAgadkZWZhdWx0laFsqnNhbXBsZVNpemUywMDcADSXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaaliYXNlQ2xhbXCTAiIowACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA/AwJDAwpmhZAkABgiRBsDCmaFpqWNvcHlBcnJheZIGIcABp2RlZmF1bHTAwMCYoXILCcDAkQXAwpyhaQEBBQuRCMDCAcLAwJihZwgPwMCQwMKZoWQJAAoMkQrAwpmhaatzaHVmZmxlU2VsZpMKICfAAqdkZWZhdWx0wMDAmKFyCwvAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcID8DAkMDCmaFkCQAOEJEOwMKZoWmmdmFsdWVzkg4mwAOnZGVmYXVsdMDAwJihcgsGwMCRDcDCnKFpAQENE5EQwMIDwsDAmKFnCA3AwJDAwpmhZAkAEhSREsDCmaFpp2lzQXJyYXmSEi7ABKdkZWZhdWx0wMDAmKFyCwfAwJERwMKcoWkBAREXkRTAwgTCwMCYoWcIDsDAkMDCmaFkCQAWGJEWwMKZoWmuaXNJdGVyYXRlZUNhbGySFizABadkZWZhdWx0wMDAmKFyCw7AwJEVwMKcoWkBARUbkRjAwgXCwMCYoWcIDsDAkMDCmaFkCQAaHJEawMKZoWmpdG9JbnRlZ2VykhotwAanZGVmYXVsdMDAwJihcgsJwMCRGcDCnKFpAQEZHZEcwMIGwsDAmKFnCBDAwJDAwpehbwEAHiOQwJmhZAAYH8CUICEiH8DCmaFsr2FycmF5U2FtcGxlU2l6ZZIfL8DAwMCQ2VBXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2FycmF5U2FtcGxlU2l6ZS5qc5ihcgkPwCCRHsDCmKFyFgvAIZEJwMKYoXIBCcAikQXAwpihcgkJwMCRAcDCl6FvAQAkKZDAmaFkABglwJQmJyglwMKZoWyuYmFzZVNhbXBsZVNpemWSJTDAwMDAkNlPV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlU2FtcGxlU2l6ZS5qc5ihcgkOwCaRJMDCmKFyIAbAJ5ENwMKYoXIXC8AokQnAwpihcggJwMCRAcDCl6FvAQAqMZDAmaFkACErwJYsLS4vMCvAwpmhbKpzYW1wbGVTaXplkiszwMDAwJDZSlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9zYW1wbGVTaXplLmpzmKFyCQrALJEqwMKYoXInDsAtkRXAwpihckoJwC6RGcDCmKFyFwfAL5ERwMKYoXIPD8AwkR7AwpihcgMOwMCRJMDCmKFnAQMywJDAwpihZwkLM8CRM8DCmKFyAArAwJEqwMI=
====catalogjs annotation end====*/