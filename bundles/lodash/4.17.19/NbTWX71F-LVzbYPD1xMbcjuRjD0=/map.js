import { default as arrayMap } from "./dist/98.js";
import { default as baseIteratee } from "./dist/6.js";
import { default as baseMap } from "./dist/74.js";
import { default as isArray } from "./isArray.js";
function map(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee, 3));
}
export { map as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvOTguanMDwsCVwqsuL2Rpc3QvNi5qcwbCwJXCrC4vZGlzdC83NC5qcwnCwJXCrC4vaXNBcnJheS5qcwzCwIGnZGVmYXVsdJShbKNtYXAVwNwAF5ehbwAAA8CRDsCZoWQJAALAkQLAwpihaahhcnJheU1hcJICEcAAp2RlZmF1bHTAwJihcgsIwMCRAcDCnKFpABcBBpDAwgDCwMCZoWQJAAXAkQXAwpihaaxiYXNlSXRlcmF0ZWWSBRPAAadkZWZhdWx0wMCYoXILDMDAkQTAwpyhaQEWBAmQwMIBwsDAmaFkCQAIwJEIwMKYoWmnYmFzZU1hcJIIEsACp2RlZmF1bHTAwJihcgsHwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpihaadpc0FycmF5kgsQwAOnZGVmYXVsdMDAmKFyCwfAwJEKwMKcoWkBFwoNkMDCA8LAwJehbwEADhSQwJmhZAARD8CVEBESEw/AwpihbKNtYXCSDxbAwMDA2UNXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbWFwLmpzmKFyCQPAEJEOwMKYoXImB8ARkQrAwpihcg8IwBKRAcDCmKFyAwfAE5EHwMKYoXIcDMDAkQTAwpihZwEDFcCQwMKYoWcJCxbAkRbAwpihcgADwMCRDsDC
====catalogjs annotation end====*/