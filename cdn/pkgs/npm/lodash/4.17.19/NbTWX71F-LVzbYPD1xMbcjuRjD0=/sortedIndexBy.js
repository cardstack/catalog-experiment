import { default as baseIteratee } from "./dist/6.js";
import { default as baseSortedIndexBy } from "./dist/31.js";
function sortedIndexBy(array, value, iteratee) {
  return baseSortedIndexBy(array, value, baseIteratee(iteratee, 2));
}
export { sortedIndexBy as default };
/*====catalogjs annotation start====
k5KVwqsuL2Rpc3QvNi5qcwPCwJXCrC4vZGlzdC8zMS5qcwbCwIGnZGVmYXVsdJWhbK1zb3J0ZWRJbmRleEJ5DcDAn5ehbwAAA8CQwJmhZAkAAsCRAsDCmaFprGJhc2VJdGVyYXRlZZICC8AAp2RlZmF1bHTAwMCYoXILDMDAkQHAwpyhaQAWAQaQwMIAwsDAmaFkCQAFwJEFwMKZoWmxYmFzZVNvcnRlZEluZGV4QnmSBQrAAadkZWZhdWx0wMDAmKFyCxHAwJEEwMKcoWkBFwQHkMDCAcLAwJehbwEACAyQwJmhZAARCcCTCgsJwMKZoWytc29ydGVkSW5kZXhCeZIJDsDAwMCQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvc29ydGVkSW5kZXhCeS5qc5ihcgkNwAqRCMDCmKFyJBHAC5EEwMKYoXIPDMDAkQHAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgANwMCRCMDC
====catalogjs annotation end====*/