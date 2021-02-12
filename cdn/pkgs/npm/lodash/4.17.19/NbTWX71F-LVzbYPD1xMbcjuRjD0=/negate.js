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
k5CBp2RlZmF1bHSVoWymbmVnYXRlCcDAm5ehbwAAAcCQwJehbwAAAgiQwJihZwABAwWQwMKZoWQEGATAkgQCwMKZoWyvRlVOQ19FUlJPUl9URVhUkgQHwMDAApDZRlducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9uZWdhdGUuanOYoXIAD8DAkQPAwpmhZAHNAZQGwJMHBgPAwpmhbKZuZWdhdGWSBgrAwMDAkNlGV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL25lZ2F0ZS5qc5ihcgkGwAeRBcDCmKFyTg/AwJEDwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIABsDAkQXAwg==
====catalogjs annotation end====*/