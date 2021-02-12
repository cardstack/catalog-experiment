import { default as baseRest } from "./49.js";
import { default as isIterateeCall } from "./70.js";
function createAssigner(assigner) {
  return baseRest(function (object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;
    customizer = assigner.length > 3 && typeof customizer == 'function' ? (length--, customizer) : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }

    object = Object(object);

    while (++index < length) {
      var source = sources[index];

      if (source) {
        assigner(object, source, index, customizer);
      }
    }

    return object;
  });
}
export { createAssigner as default };
/*====catalogjs annotation start====
k5KVwqcuLzQ5LmpzA8LAlcKnLi83MC5qcwbCwIGnZGVmYXVsdJWhbK5jcmVhdGVBc3NpZ25lcg3AwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpmhaahiYXNlUmVzdJICCsAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQASAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmuaXNJdGVyYXRlZUNhbGySBQvAAadkZWZhdWx0wMDAmKFyCw7AwJEEwMKcoWkBEgQHkMDCAcLAwJehbwEACAyQwJmhZADNAUcJwJMKCwnAwpmhbK5jcmVhdGVBc3NpZ25lcpIJDsDAwMCQ2U9XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZUFzc2lnbmVyLmpzmKFyCQ7ACpEIwMKYoXIWCMALkQHAwpihcs0BSw7AwJEEwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIADsDAkQjAwg==
====catalogjs annotation end====*/