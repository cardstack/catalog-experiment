var nativeMax = Math.max;
function composeArgsRight(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersIndex = -1,
      holdersLength = holders.length,
      rightIndex = -1,
      rightLength = partials.length,
      rangeLength = nativeMax(argsLength - holdersLength, 0),
      result = Array(rangeLength + rightLength),
      isUncurried = !isCurried;

  while (++argsIndex < rangeLength) {
    result[argsIndex] = args[argsIndex];
  }

  var offset = argsIndex;

  while (++rightIndex < rightLength) {
    result[offset + rightIndex] = partials[rightIndex];
  }

  while (++holdersIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[offset + holders[holdersIndex]] = args[argsIndex++];
    }
  }

  return result;
}
export { composeArgsRight as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWywY29tcG9zZUFyZ3NSaWdodAnAwJuXoW8AAAHAkMCXoW8AAAIIkMCYoWcAAQMFkMDCmaFkBAsEwJIEAsDCmaFsqW5hdGl2ZU1heJIEB8DAwAKQ2VFXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2NvbXBvc2VBcmdzUmlnaHQuanOYoXIACcDAkQPAwpmhZAHNAgEGwJMHBgPAwpmhbLBjb21wb3NlQXJnc1JpZ2h0kgYKwMDAwJDZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY29tcG9zZUFyZ3NSaWdodC5qc5ihcgkQwAeRBcDCmKFyzOwJwMCRA8DCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyABDAwJEFwMI=
====catalogjs annotation end====*/