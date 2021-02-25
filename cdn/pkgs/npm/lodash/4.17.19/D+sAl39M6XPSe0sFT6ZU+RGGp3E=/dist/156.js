function baseProperty(key) {
  return function (object) {
    return object == null ? undefined : object[key];
  };
}
export { baseProperty as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSVoWysYmFzZVByb3BlcnR5BcDAl5ehbwAAAcCQwJehbwAAAgSQwJmhZABgA8CRA8DCmaFsrGJhc2VQcm9wZXJ0eZIDBsDAwMCQ2U1XbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VQcm9wZXJ0eS5qc5ihcgkMwMCRAsDCmKFnAQMFwJDAwpihZwkLBsCRBsDCmKFyAAzAwJECwMI=
====catalogjs annotation end====*/