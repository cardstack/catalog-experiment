var funcProto = Function.prototype;
var funcToString = funcProto.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}

    try {
      return func + '';
    } catch (e) {}
  }

  return '';
}
export { toSource as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWyodG9Tb3VyY2UNwMCfl6FvAAABwJDAl6FvAAACDJDAmKFnAAEDBZDAwpmhZAQVBMCSBALAwpmhbKlmdW5jUHJvdG+SBAjAwMACkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL190b1NvdXJjZS5qc5ihcgAJwMCRA8DCmKFnAQEGCZDAwpmhZAQJB8CUCAcFA8DCmaFsrGZ1bmNUb1N0cmluZ5IHC8DAwAWQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX3RvU291cmNlLmpzmKFyAAzACJEGwMKYoXIDCcDAkQPAwpmhZAFpCsCTCwoGwMKZoWyodG9Tb3VyY2WSCg7AwMDAkNlJV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL190b1NvdXJjZS5qc5ihcgkIwAuRCcDCmKFyNgzAwJEGwMKYoWcBAw3AkMDCmKFnCQsOwJEOwMKYoXIACMDAkQnAwg==
====catalogjs annotation end====*/