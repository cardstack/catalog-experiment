import { default as baseFlatten } from "./dist/85.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseRest } from "./dist/49.js";
import { default as baseUniq } from "./dist/63.js";
import { default as isArrayLikeObject } from "./isArrayLikeObject.js";
import { default as last } from "./last.js";
var unionBy = baseRest(function (arrays) {
  var iteratee = last(arrays);

  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }

  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), baseIteratee(iteratee, 2));
});
export { unionBy as default };
/*====catalogjs annotation start====
k5aVwqwuL2Rpc3QvODUuanMDwsCVwqsuL2Rpc3QvNi5qcwfCwJXCrC4vZGlzdC80OS5qcwvCwJXCrC4vZGlzdC82My5qcw/CwJXCti4vaXNBcnJheUxpa2VPYmplY3QuanMTwsCVwqkuL2xhc3QuanMXwsCBp2RlZmF1bHSVoWyndW5pb25CeSbAwNwAKJehbwAAA8CRG8CZoWQJAAIEkQLAwpmhaatiYXNlRmxhdHRlbpICIsAAp2RlZmF1bHTAwMCYoXILC8DAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaaxiYXNlSXRlcmF0ZWWSBiTAAadkZWZhdWx0wMDAmKFyCwzAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDcDAkMDCmaFkCQAKDJEKwMKZoWmoYmFzZVJlc3SSCh7AAqdkZWZhdWx0wMDAmKFyCwjAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIDsDAkMDCmaFkCQAOEJEOwMKZoWmoYmFzZVVuaXGSDiHAA6dkZWZhdWx0wMDAmKFyCwjAwJENwMKcoWkBAQ0TkRDAwgPCwMCYoWcIDsDAkMDCmaFkCQASFJESwMKZoWmxaXNBcnJheUxpa2VPYmplY3STEiAjwASnZGVmYXVsdMDAwJihcgsRwMCREcDCnKFpAQERF5EUwMIEwsDAmKFnCBjAwJDAwpmhZAkAFhiRFsDCmaFppGxhc3SSFh/ABadkZWZhdWx0wMDAmKFyCwTAwJEVwMKcoWkBARUZkRjAwgXCwMCYoWcIC8DAkMDCl6FvAQAaJZDAmKFnAAEbwJDAwpmhZAQAHMCTHBodwMKZoWyndW5pb25CeZIcJ8DAwBqQ2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdW5pb25CeS5qc5ihcgAHwB2RG8DCmKFnAxIewJceHyAhIiMkwMKYoXIACMAfkQnAwpihciYEwCCRFcDCmKFyERHAIZERwMKYoXI2CMAikQ3AwpihcgELwCORAcDCmKFyDBHAJJERwMKYoXIJDMDAkQXAwpihZwEDJsCQwMKYoWcJCyfAkSfAwpihcgAHwMCRG8DC
====catalogjs annotation end====*/