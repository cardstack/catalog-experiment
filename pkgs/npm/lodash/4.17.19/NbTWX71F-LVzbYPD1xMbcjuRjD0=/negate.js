var FUNC_ERROR_TEXT = 'Expected a function';
function negate(predicate) {
  if (typeof predicate != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  return function () {
    var args = arguments;

    switch (args.length) {
      case 0:
        return !predicate.call(this);

      case 1:
        return !predicate.call(this, args[0]);

      case 2:
        return !predicate.call(this, args[0], args[1]);

      case 3:
        return !predicate.call(this, args[0], args[1], args[2]);
    }

    return !predicate.apply(this, args);
  };
}
export { negate as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSUoWymbmVnYXRlCcCbl6FvAAABwJDAl6FvAAACCJDAmKFnAAEDBZDAwpmhZAQYBMCSBALAwpihbK9GVU5DX0VSUk9SX1RFWFSSBAfAwMAC2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvbmVnYXRlLmpzmKFyAA/AwJEDwMKZoWQBzQGUBsCTBwYDwMKYoWymbmVnYXRlkgYKwMDAwNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL25lZ2F0ZS5qc5ihcgkGwAeRBcDCmKFyTg/AwJEDwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIABsDAkQXAwg==
====catalogjs annotation end====*/