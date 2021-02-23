function compact(array) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];

    if (value) {
      result[resIndex++] = value;
    }
  }

  return result;
}
export { compact as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWynY29tcGFjdAXAwJeXoW8AAAHAkMCXoW8AAAIEkMCZoWQAzQEBA8CRA8DCmaFsp2NvbXBhY3SSAwbAwMDAkNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL2NvbXBhY3QuanOYoXIJB8DAkQLAwpihZwEDBcCQwMKYoWcJCwbAkQbAwpihcgAHwMCRAsDC
====catalogjs annotation end====*/