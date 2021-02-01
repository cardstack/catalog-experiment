var MAX_SAFE_INTEGER = 9007199254740991;
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
export { isLength as default };
/*====catalogjs annotation start====
k5CBp2RlZmF1bHSUoWyoaXNMZW5ndGgJwJuXoW8AAAHAkMCXoW8AAAIIkMCYoWcAAQMFkMDCmaFkBBMEwJIEAsDCmKFssE1BWF9TQUZFX0lOVEVHRVKSBAfAwMAC2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNMZW5ndGguanOYoXIAEMDAkQPAwpmhZAEDBsCTBwYDwMKYoWyoaXNMZW5ndGiSBgrAwMDA2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNMZW5ndGguanOYoXIJCMAHkQXAwpihclgQwMCRA8DCmKFnAQMJwJDAwpihZwkLCsCRCsDCmKFyAAjAwJEFwMI=
====catalogjs annotation end====*/