function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
  eachFunc(collection, function (value, index, collection) {
    accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index, collection);
  });
  return accumulator;
}
export { baseReduce as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWyqYmFzZVJlZHVjZQXAwJeXoW8AAAHAkMCXoW8AAAIEkMCZoWQAzQEBA8CRA8DCmaFsqmJhc2VSZWR1Y2WSAwbAwMDAkNlLV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19iYXNlUmVkdWNlLmpzmKFyCQrAwJECwMKYoWcBAwXAkMDCmKFnCQsGwJEGwMKYoXIACsDAkQLAwg==
====catalogjs annotation end====*/