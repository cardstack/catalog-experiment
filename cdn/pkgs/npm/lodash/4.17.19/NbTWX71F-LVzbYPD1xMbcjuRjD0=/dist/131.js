import { default as eq } from "../eq.js";
function baseSortedUniq(array, iteratee) {
  var index = -1,
      length = array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    if (!index || !eq(computed, seen)) {
      var seen = computed;
      result[resIndex++] = value === 0 ? 0 : value;
    }
  }

  return result;
}
export { baseSortedUniq as default };
/*====catalogjs annotation start====
k5GVwqguLi9lcS5qcwPCwIGnZGVmYXVsdJWhbK5iYXNlU29ydGVkVW5pcQnAwJuXoW8AAAPAkMCZoWQJAALAkQLAwpmhaaJlcZICB8AAp2RlZmF1bHTAwMCYoXILAsDAkQHAwpyhaQATAQSQwMIAwsDAl6FvAQAFCJDAmaFkAMyABsCSBwbAwpmhbK5iYXNlU29ydGVkVW5pcZIGCsDAwMCQ2U9XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VTb3J0ZWRVbmlxLmpzmKFyCQ7AB5EFwMKYoXLM8QLAwJEBwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIADsDAkQXAwg==
====catalogjs annotation end====*/