function baseZipObject(props, values, assignFunc) {
  var index = -1,
      length = props.length,
      valsLength = values.length,
      result = {};

  while (++index < length) {
    var value = index < valsLength ? values[index] : undefined;
    assignFunc(result, props[index], value);
  }

  return result;
}
export { baseZipObject as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWytYmFzZVppcE9iamVjdAXAwJeXoW8AAAHAkMCXoW8AAAIEkMCZoWQAzQEkA8CRA8DCmaFsrWJhc2VaaXBPYmplY3SSAwbAwMDAkNlOV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlWmlwT2JqZWN0LmpzmKFyCQ3AwJECwMKYoWcBAwXAkMDCmKFnCQsGwJEGwMKYoXIADcDAkQLAwg==
====catalogjs annotation end====*/