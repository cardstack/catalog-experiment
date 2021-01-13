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
k5CBp2RlZmF1bHSUoWynY29tcGFjdAXAl5ehbwAAAcCRAsCXoW8AAAIEkMCZoWQAzQEBA8CRA8DCmKFsp2NvbXBhY3SSAwbAwMDA2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY29tcGFjdC5qc5ihcgkHwMCRAsDCmKFnAQMFwJDAwpihZwkLBsCRBsDCmKFyAAfAwJECwMI=
====catalogjs annotation end====*/