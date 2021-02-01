import { default as baseIteratee } from "./dist/6.js";
import { default as baseUniq } from "./dist/63.js";
function uniqBy(array, iteratee) {
  return array && array.length ? baseUniq(array, baseIteratee(iteratee, 2)) : [];
}
export { uniqBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrC4vZGlzdC82My5qcwbCwIGnZGVmYXVsdJShbKZ1bmlxQnkNwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpihaaxiYXNlSXRlcmF0ZWWSAgvAAKdkZWZhdWx0wMCYoXILDMDAkQHAwpyhaQAWAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmoYmFzZVVuaXGSBQrAAadkZWZhdWx0wMCYoXILCMDAkQTAwpyhaQEXBAeQwMIBwsDAl6FvAQAIDJDAmaFkABYJwJMKCwnAwpihbKZ1bmlxQnmSCQ7AwMDA2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdW5pcUJ5LmpzmKFyCQbACpEIwMKYoXI1CMALkQTAwpihcggMwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAbAwJEIwMI=
====catalogjs annotation end====*/