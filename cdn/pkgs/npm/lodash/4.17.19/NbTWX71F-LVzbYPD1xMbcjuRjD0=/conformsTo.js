import { default as baseConformsTo } from "./dist/157.js";
import { default as keys } from "./keys.js";
function conformsTo(object, source) {
  return source == null || baseConformsTo(object, source, keys(source));
}
export { conformsTo as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTU3LmpzA8LAlcKpLi9rZXlzLmpzBsLAgadkZWZhdWx0laFsqmNvbmZvcm1zVG8NwMCfl6FvAAADwJDAmaFkCQACwJECwMKZoWmuYmFzZUNvbmZvcm1zVG+SAgrAAKdkZWZhdWx0wMDAmKFyCw7AwJEBwMKcoWkAGAEGkMDCAMLAwJmhZAkABcCRBcDCmaFppGtleXOSBQvAAadkZWZhdWx0wMDAmKFyCwTAwJEEwMKcoWkBFAQHkMDCAcLAwJehbwEACAyQwJmhZAAMCcCTCgsJwMKZoWyqY29uZm9ybXNUb5IJDsDAwMCQ2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY29uZm9ybXNUby5qc5ihcgkKwAqRCMDCmKFyLg7AC5EBwMKYoXIRBMDAkQTAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAKwMCRCMDC
====catalogjs annotation end====*/