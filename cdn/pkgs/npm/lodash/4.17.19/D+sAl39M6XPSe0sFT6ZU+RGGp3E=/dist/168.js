function baseSum(array, iteratee) {
  var result,
      index = -1,
      length = array.length;

  while (++index < length) {
    var current = iteratee(array[index]);

    if (current !== undefined) {
      result = result === undefined ? current : result + current;
    }
  }

  return result;
}
export { baseSum as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWynYmFzZVN1bQXAwJeXoW8AAAHAkMCXoW8AAAIEkMCZoWQAzQEaA8CRA8DCmaFsp2Jhc2VTdW2SAwbAwMDAkNlIV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlU3VtLmpzmKFyCQfAwJECwMKYoWcBAwXAkMDCmKFnCQsGwJEGwMKYoXIAB8DAkQLAwg==
====catalogjs annotation end====*/