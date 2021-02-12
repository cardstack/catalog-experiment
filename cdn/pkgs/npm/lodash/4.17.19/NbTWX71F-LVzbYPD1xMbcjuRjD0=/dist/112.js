var nativeMax = Math.max;
function composeArgs(args, partials, holders, isCurried) {
  var argsIndex = -1,
      argsLength = args.length,
      holdersLength = holders.length,
      leftIndex = -1,
      leftLength = partials.length,
      rangeLength = nativeMax(argsLength - holdersLength, 0),
      result = Array(leftLength + rangeLength),
      isUncurried = !isCurried;

  while (++leftIndex < leftLength) {
    result[leftIndex] = partials[leftIndex];
  }

  while (++argsIndex < holdersLength) {
    if (isUncurried || argsIndex < argsLength) {
      result[holders[argsIndex]] = args[argsIndex];
    }
  }

  while (rangeLength--) {
    result[leftIndex++] = args[argsIndex++];
  }

  return result;
}
export { composeArgs as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWyrY29tcG9zZUFyZ3MJwMCbl6FvAAABwJDAl6FvAAACCJDAmKFnAAEDBZDAwpmhZAQLBMCSBALAwpmhbKluYXRpdmVNYXiSBAfAwMACkNlMV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jb21wb3NlQXJncy5qc5ihcgAJwMCRA8DCmaFkAc0BvwbAkwcGA8DCmaFsq2NvbXBvc2VBcmdzkgYKwMDAwJDZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fY29tcG9zZUFyZ3MuanOYoXIJC8AHkQXAwpihcszRCcDAkQPAwpihZwEDCcCQwMKYoWcJCwrAkQrAwpihcgALwMCRBcDC
====catalogjs annotation end====*/