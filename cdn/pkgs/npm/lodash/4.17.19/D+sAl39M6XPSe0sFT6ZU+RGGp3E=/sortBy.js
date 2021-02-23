import { default as baseFlatten } from "./dist/85.js";
import { default as baseOrderBy } from "./dist/4.js";
import { default as baseRest } from "./dist/49.js";
import { default as isIterateeCall } from "./dist/70.js";
var sortBy = baseRest(function (collection, iteratees) {
  if (collection == null) {
    return [];
  }

  var length = iteratees.length;

  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }

  return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
});
export { sortBy as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvODUuanMDwsCVwqsuL2Rpc3QvNC5qcwfCwJXCrC4vZGlzdC80OS5qcwvCwJXCrC4vZGlzdC83MC5qcw/CwIGnZGVmYXVsdJWhbKZzb3J0QnkcwMDcAB6XoW8AAAPAkRPAmaFkCQACBJECwMKZoWmrYmFzZUZsYXR0ZW6SAhrAAKdkZWZhdWx0wMDAmKFyCwvAwJEBwMKcoWkAAQEHkQTAwgDCwMCYoWcIDsDAkMDCmaFkCQAGCJEGwMKZoWmrYmFzZU9yZGVyQnmSBhnAAadkZWZhdWx0wMDAmKFyCwvAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDcDAkMDCmaFkCQAKDJEKwMKZoWmoYmFzZVJlc3SSChbAAqdkZWZhdWx0wMDAmKFyCwjAwJEJwMKcoWkBAQkPkQzAwgLCwMCYoWcIDsDAkMDCmaFkCQAOEJEOwMKZoWmuaXNJdGVyYXRlZUNhbGyTDhcYwAOnZGVmYXVsdMDAwJihcgsOwMCRDcDCnKFpAQENEZEQwMIDwsDAmKFnCA7AwJDAwpehbwEAEhuQwJihZwABE8CQwMKZoWQEABTAkxQSFcDCmaFspnNvcnRCeZIUHcDAwBKQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc29ydEJ5LmpzmKFyAAbAFZETwMKYoWcDFxbAlRYXGBkawMKYoXIACMAXkQnAwpihcsyKDsAYkQ3AwpihclsOwBmRDcDCmKFyXAvAGpEFwMKYoXINC8DAkQHAwpihZwEDHMCQwMKYoWcJCx3AkR3AwpihcgAGwMCRE8DC
====catalogjs annotation end====*/