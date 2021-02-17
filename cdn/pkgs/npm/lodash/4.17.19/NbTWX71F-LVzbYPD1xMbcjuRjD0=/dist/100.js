import { default as baseCreate } from "./106.js";
import { default as isObject } from "../isObject.js";
function createCtor(Ctor) {
  return function () {
    var args = arguments;

    switch (args.length) {
      case 0:
        return new Ctor();

      case 1:
        return new Ctor(args[0]);

      case 2:
        return new Ctor(args[0], args[1]);

      case 3:
        return new Ctor(args[0], args[1], args[2]);

      case 4:
        return new Ctor(args[0], args[1], args[2], args[3]);

      case 5:
        return new Ctor(args[0], args[1], args[2], args[3], args[4]);

      case 6:
        return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);

      case 7:
        return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
    }

    var thisBinding = baseCreate(Ctor.prototype),
        result = Ctor.apply(thisBinding, args);
    return isObject(result) ? result : thisBinding;
  };
}
export { createCtor as default };
/*====catalogjs annotation start====
k5KVwqguLzEwNi5qcwPCwJXCri4uL2lzT2JqZWN0LmpzB8LAgadkZWZhdWx0laFsqmNyZWF0ZUN0b3IPwMDcABGXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaapiYXNlQ3JlYXRlkgIMwACnZGVmYXVsdMDAwJihcgsKwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCArAwJDAwpmhZAkABgiRBsDCmaFpqGlzT2JqZWN0kgYNwAGnZGVmYXVsdMDAwJihcgsIwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCBDAwJDAwpehbwEACg6QwJmhZAAnC8CTDA0LwMKZoWyqY3JlYXRlQ3RvcpILEMDAwMCQ2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NyZWF0ZUN0b3IuanOYoXIJCsAMkQrAwpihcs0CsArADZEBwMKYoXJNCMDAkQXAwpihZwEDD8CQwMKYoWcJCxDAkRDAwpihcgAKwMCRCsDC
====catalogjs annotation end====*/