function createBaseFor(fromRight) {
  return function (object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];

      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }

    return object;
  };
}
export { createBaseFor as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWytY3JlYXRlQmFzZUZvcgXAwJeXoW8AAAHAkMCXoW8AAAIEkMCZoWQAzQF6A8CRA8DCmaFsrWNyZWF0ZUJhc2VGb3KSAwbAwMDAkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19jcmVhdGVCYXNlRm9yLmpzmKFyCQ3AwJECwMKYoWcBAwXAkMDCmKFnCQsGwJEGwMKYoXIADcDAkQLAwg==
====catalogjs annotation end====*/