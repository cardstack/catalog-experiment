function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);

    case 1:
      return func.call(thisArg, args[0]);

    case 2:
      return func.call(thisArg, args[0], args[1]);

    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }

  return func.apply(thisArg, args);
}
export { apply as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWylYXBwbHkFwMCXl6FvAAABwJDAl6FvAAACBJDAmaFkAM0BSAPAkQPAwpmhbKVhcHBseZIDBsDAwMCQ2UZXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2FwcGx5LmpzmKFyCQXAwJECwMKYoWcBAwXAkMDCmKFnCQsGwJEGwMKYoXIABcDAkQLAwg==
====catalogjs annotation end====*/