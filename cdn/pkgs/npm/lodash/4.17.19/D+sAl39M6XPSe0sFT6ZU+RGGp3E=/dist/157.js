function baseConformsTo(object, source, props) {
  var length = props.length;

  if (object == null) {
    return !length;
  }

  object = Object(object);

  while (length--) {
    var key = props[length],
        predicate = source[key],
        value = object[key];

    if (value === undefined && !(key in object) || !predicate(value)) {
      return false;
    }
  }

  return true;
}
export { baseConformsTo as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWyuYmFzZUNvbmZvcm1zVG8FwMCXl6FvAAABwJDAl6FvAAACBJDAmaFkAM0BbQPAkQPAwpmhbK5iYXNlQ29uZm9ybXNUb5IDBsDAwMCQ2U9XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VDb25mb3Jtc1RvLmpzmKFyCQ7AwJECwMKYoWcBAwXAkMDCmKFnCQsGwJEGwMKYoXIADsDAkQLAwg==
====catalogjs annotation end====*/