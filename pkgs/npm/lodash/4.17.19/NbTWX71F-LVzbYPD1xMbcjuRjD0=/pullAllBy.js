import { default as baseIteratee } from "./dist/6.js";
import { default as basePullAll } from "./dist/97.js";
function pullAllBy(array, values, iteratee) {
  return array && array.length && values && values.length ? basePullAll(array, values, baseIteratee(iteratee, 2)) : array;
}
export { pullAllBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrC4vZGlzdC85Ny5qcwbCwIGnZGVmYXVsdJShbKlwdWxsQWxsQnkNwJ+XoW8AAAPAkMCZoWQJAALAkQLAwpihaaxiYXNlSXRlcmF0ZWWSAgvAAKdkZWZhdWx0wMCYoXILDMDAkQHAwpyhaQAWAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmrYmFzZVB1bGxBbGySBQrAAadkZWZhdWx0wMCYoXILC8DAkQTAwpyhaQEXBAeQwMIBwsDAl6FvAQAIDJDAmaFkABkJwJMKCwnAwpihbKlwdWxsQWxsQnmSCQ7AwMDA2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcHVsbEFsbEJ5LmpzmKFyCQnACpEIwMKYoXJYC8ALkQTAwpihchAMwMCRAcDCmKFnAQMNwJDAwpihZwkLDsCRDsDCmKFyAAnAwJEIwMI=
====catalogjs annotation end====*/