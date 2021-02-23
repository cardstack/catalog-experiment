import { default as arrayMap } from "./dist/98.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as basePickBy } from "./dist/12.js";
import { default as getAllKeysIn } from "./dist/80.js";
function pickBy(object, predicate) {
  if (object == null) {
    return {};
  }

  var props = arrayMap(getAllKeysIn(object), function (prop) {
    return [prop];
  });
  predicate = baseIteratee(predicate);
  return basePickBy(object, props, function (value, path) {
    return predicate(value, path[0]);
  });
}
export { pickBy as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvOTguanMDwsCVwqsuL2Rpc3QvNi5qcwfCwJXCrC4vZGlzdC8xMi5qcwvCwJXCrC4vZGlzdC84MC5qcw/CwIGnZGVmYXVsdJWhbKZwaWNrQnkZwMDcABuXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaahhcnJheU1hcJICFMAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgOwMCQwMKZoWQJAAYIkQbAwpmhaaxiYXNlSXRlcmF0ZWWSBhbAAadkZWZhdWx0wMDAmKFyCwzAwJEFwMKcoWkBAQULkQjAwgHCwMCYoWcIDcDAkMDCmaFkCQAKDJEKwMKZoWmqYmFzZVBpY2tCeZIKF8ACp2RlZmF1bHTAwMCYoXILCsDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgOwMCQwMKZoWQJAA4QkQ7AwpmhaaxnZXRBbGxLZXlzSW6SDhXAA6dkZWZhdWx0wMDAmKFyCwzAwJENwMKcoWkBAQ0RkRDAwgPCwMCYoWcIDsDAkMDCl6FvAQASGJDAmaFkAFYTwJUUFRYXE8DCmaFspnBpY2tCeZITGsDAwMCQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcGlja0J5LmpzmKFyCQbAFJESwMKYoXJQCMAVkQHAwpihcgEMwBaRDcDCmKFyQwzAF5EFwMKYoXIWCsDAkQnAwpihZwEDGcCQwMKYoWcJCxrAkRrAwpihcgAGwMCREsDC
====catalogjs annotation end====*/