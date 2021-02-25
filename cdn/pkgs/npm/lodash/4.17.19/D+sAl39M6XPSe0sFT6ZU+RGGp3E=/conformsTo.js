import { default as baseConformsTo } from "./dist/157.js";
import { default as keys } from "./keys.js";
function conformsTo(object, source) {
  return source == null || baseConformsTo(object, source, keys(source));
}
export { conformsTo as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTU3LmpzA8LAlcKpLi9rZXlzLmpzB8LAgadkZWZhdWx0laFsqmNvbmZvcm1zVG8PwMDcABGXoW8AAAPAkMCZoWQJAAIEkQLAwpmhaa5iYXNlQ29uZm9ybXNUb5ICDMAAp2RlZmF1bHTAwMCYoXILDsDAkQHAwpyhaQABAQeRBMDCAMLAwJihZwgPwMCQwMKZoWQJAAYIkQbAwpmhaaRrZXlzkgYNwAGnZGVmYXVsdMDAwJihcgsEwMCRBcDCnKFpAQEFCZEIwMIBwsDAmKFnCAvAwJDAwpehbwEACg6QwJmhZAAMC8CTDA0LwMKZoWyqY29uZm9ybXNUb5ILEMDAwMCQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY29uZm9ybXNUby5qc5ihcgkKwAyRCsDCmKFyLg7ADZEBwMKYoXIRBMDAkQXAwpihZwEDD8CQwMKYoWcJCxDAkRDAwpihcgAKwMCRCsDC
====catalogjs annotation end====*/