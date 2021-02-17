import { default as hasPath } from "./dist/15.js";
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}
export { hasIn as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvMTUuanMDwsCBp2RlZmF1bHSVoWylaGFzSW4OwMDcABCXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaadoYXNQYXRokgILwACnZGVmYXVsdMDAwJihcgsHwMCRAcDCnKFpAAEBBZEEwMIAwsDAmKFnCA7AwJDAwpehbwEABgiQwJmhZABDB8CRB8DCmaFsqWJhc2VIYXNJbpIHDMDAwMCQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VIYXNJbi5qc5ihcgkJwMCRBsDCl6FvAQAJDZDAmaFkAAQKwJMLDArAwpmhbKVoYXNJbpIKD8DAwMCQ2UVXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaGFzSW4uanOYoXIJBcALkQnAwpihciwHwAyRAcDCmKFyDwnAwJEGwMKYoWcBAw7AkMDCmKFnCQsPwJEPwMKYoXIABcDAkQnAwg==
====catalogjs annotation end====*/