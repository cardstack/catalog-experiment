import { default as baseConformsTo } from "./dist/157.js";
import { default as keys } from "./keys.js";
function conformsTo(object, source) {
  return source == null || baseConformsTo(object, source, keys(source));
}
export { conformsTo as default };
/*====catalogjs annotation start====
k5KVwq0uL2Rpc3QvMTU3LmpzA8LAlcKpLi9rZXlzLmpzBsLAgadkZWZhdWx0lKFsqmNvbmZvcm1zVG8NwJ+XoW8AAAPAkQjAmaFkCQACwJECwMKYoWmuYmFzZUNvbmZvcm1zVG+SAgrAAKdkZWZhdWx0wMCYoXILDsDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmka2V5c5IFC8ABp2RlZmF1bHTAwJihcgsEwMCRBMDCnKFpARQEB5DAwgHCwMCXoW8BAAgMkMCZoWQADAnAkwoLCcDCmKFsqmNvbmZvcm1zVG+SCQ7AwMDA2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY29uZm9ybXNUby5qc5ihcgkKwAqRCMDCmKFyLg7AC5EBwMKYoXIRBMDAkQTAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAKwMCRCMDC
====catalogjs annotation end====*/