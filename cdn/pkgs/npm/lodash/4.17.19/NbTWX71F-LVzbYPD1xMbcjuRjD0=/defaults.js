import { default as baseRest } from "./dist/49.js";
import { default as eq } from "./eq.js";
import { default as isIterateeCall } from "./dist/70.js";
import { default as keysIn } from "./keysIn.js";
var objectProto = Object.prototype;
var hasOwnProperty0 = objectProto.hasOwnProperty;
var defaults = baseRest(function (object, sources) {
  object = Object(object);
  var index = -1;
  var length = sources.length;
  var guard = length > 2 ? sources[2] : undefined;

  if (guard && isIterateeCall(sources[0], sources[1], guard)) {
    length = 1;
  }

  while (++index < length) {
    var source = sources[index];
    var props = keysIn(source);
    var propsIndex = -1;
    var propsLength = props.length;

    while (++propsIndex < propsLength) {
      var key = props[propsIndex];
      var value = object[key];

      if (value === undefined || eq(value, objectProto[key]) && !hasOwnProperty0.call(object, key)) {
        object[key] = source[key];
      }
    }
  }

  return object;
});
export { defaults as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvNDkuanMDwsCVwqcuL2VxLmpzB8LAlcKsLi9kaXN0LzcwLmpzC8LAlcKrLi9rZXlzSW4uanMPwsCBp2RlZmF1bHSVoWyoZGVmYXVsdHMkwMDcACaXoW8AAAPAkRrAmaFkCQACBJECwMKZoWmoYmFzZVJlc3SSAh3AAKdkZWZhdWx0wMDAmKFyCwjAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmiZXGSBiDAAadkZWZhdWx0wMDAmKFyCwLAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcICcDAkMDCmaFkCQAKDJEKwMKZoWmuaXNJdGVyYXRlZUNhbGySCh7AAqdkZWZhdWx0wMDAmKFyCw7AwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIDsDAkMDCmaFkCQAOEJEOwMKZoWmma2V5c0lukg4fwAOnZGVmYXVsdMDAwJihcgsGwMCRDcDCnKFpAQENEZEQwMIDwsDAmKFnCA3AwJDAwpehbwEAEiOQwJihZwABExWQwMKZoWQEExTAkhQSwMKZoWyrb2JqZWN0UHJvdG+TFBghwMDAEpDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9kZWZhdWx0cy5qc5ihcgALwMCRE8DCmKFnAQEWGZDAwpmhZAQPF8CUGBcVE8DCmaFsr2hhc093blByb3BlcnR5MJIXIsDAwBWQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZGVmYXVsdHMuanOYoXIAD8AYkRbAwpihcgMLwMCRE8DCmKFnAQEawJDAwpmhZAQAG8CVGxkcExbAwpmhbKhkZWZhdWx0c5IbJcDAwBmQ2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvZGVmYXVsdHMuanOYoXIACMAckRrAwpihZwNfHcCWHR4fICEiwMKYoXIACMAekQHAwpihcsytDsAfkQnAwpihcsyGBsAgkQ3AwpihcszVAsAhkQXAwpihcggLwCKRE8DCmKFyCw/AwJEWwMKYoWcBAyTAkMDCmKFnCQslwJElwMKYoXIACMDAkRrAwg==
====catalogjs annotation end====*/