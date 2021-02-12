function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while (fromRight ? index-- : ++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }

  return -1;
}
export { baseFindIndex as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWytYmFzZUZpbmRJbmRleAXAwJeXoW8AAAHAkMCXoW8AAAIEkMCZoWQAzQEKA8CRA8DCmaFsrWJhc2VGaW5kSW5kZXiSAwbAwMDAkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlRmluZEluZGV4LmpzmKFyCQ3AwJECwMKYoWcBAwXAkMDCmKFnCQsGwJEGwMKYoXIADcDAkQLAwg==
====catalogjs annotation end====*/