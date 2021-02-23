import { default as isSymbol } from "../isSymbol.js";
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = isSymbol(value);
    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = isSymbol(other);

    if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
      return 1;
    }

    if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
      return -1;
    }
  }

  return 0;
}
export { compareAscending as default };
/*====catalogjs annotation start====
k5GVwq4uLi9pc1N5bWJvbC5qcwPCwIGnZGVmYXVsdJWhbLBjb21wYXJlQXNjZW5kaW5nC8DAnZehbwAAA8CQwJmhZAkAAgSRAsDCmaFpqGlzU3ltYm9skwIICcAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQABAQWRBMDCAMLAwJihZwgQwMCQwMKXoW8BAAYKkMCZoWQAzQJAB8CTCAkHwMKZoWywY29tcGFyZUFzY2VuZGluZ5IHDMDAwMCQ2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NvbXBhcmVBc2NlbmRpbmcuanOYoXIJEMAIkQbAwpihcsy6CMAJkQHAwpihcsyZCMDAkQHAwpihZwEDC8CQwMKYoWcJCwzAkQzAwpihcgAQwMCRBsDC
====catalogjs annotation end====*/