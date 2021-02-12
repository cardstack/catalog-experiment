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
k5GVwq4uLi9pc1N5bWJvbC5qcwPCwIGnZGVmYXVsdJWhbLBjb21wYXJlQXNjZW5kaW5nCsDAnJehbwAAA8CQwJmhZAkAAsCRAsDCmaFpqGlzU3ltYm9skwIHCMAAp2RlZmF1bHTAwMCYoXILCMDAkQHAwpyhaQAZAQSQwMIAwsDAl6FvAQAFCZDAmaFkAM0CQAbAkwcIBsDCmaFssGNvbXBhcmVBc2NlbmRpbmeSBgvAwMDAkNlRV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jb21wYXJlQXNjZW5kaW5nLmpzmKFyCRDAB5EFwMKYoXLMugjACJEBwMKYoXLMmQjAwJEBwMKYoWcBAwrAkMDCmKFnCQsLwJELwMKYoXIAEMDAkQXAwg==
====catalogjs annotation end====*/