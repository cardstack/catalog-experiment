import { default as baseRest } from "./dist/49.js";
import { default as unzipWith } from "./unzipWith.js";
var zipWith = baseRest(function (arrays) {
  var length = arrays.length,
      iteratee = length > 1 ? arrays[length - 1] : undefined;
  iteratee = typeof iteratee == 'function' ? (arrays.pop(), iteratee) : undefined;
  return unzipWith(arrays, iteratee);
});
export { zipWith as default };
/*====catalogjs annotation start====
k5KVwqwuL2Rpc3QvNDkuanMDwsCVwq4uL3VuemlwV2l0aC5qcwfCwIGnZGVmYXVsdJWhbKd6aXBXaXRoEcDA3AATl6FvAAADwJELwJmhZAkAAgSRAsDCmaFpqGJhc2VSZXN0kgIOwACnZGVmYXVsdMDAwJihcgsIwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCA7AwJDAwpmhZAkABgiRBsDCmaFpqXVuemlwV2l0aJIGD8ABp2RlZmF1bHTAwMCYoXILCcDAkQXAwpyhaQEBBQmRCMDCAcLAwJihZwgQwMCQwMKXoW8BAAoQkMCYoWcAAQvAkMDCmaFkBAAMwJMMCg3AwpmhbKd6aXBXaXRokgwSwMDACpDZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy96aXBXaXRoLmpzmKFyAAfADZELwMKYoWcDFg7Akg4PwMKYoXIACMAPkQHAwpihcszNCcDAkQXAwpihZwEDEcCQwMKYoWcJCxLAkRLAwpihcgAHwMCRC8DC
====catalogjs annotation end====*/