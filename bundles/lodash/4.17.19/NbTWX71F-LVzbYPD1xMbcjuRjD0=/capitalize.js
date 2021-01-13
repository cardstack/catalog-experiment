import { default as toString } from "./toString.js";
import { default as upperFirst } from "./upperFirst.js";
function capitalize(string) {
  return upperFirst(toString(string).toLowerCase());
}
export { capitalize as default };
/*====catalogjs annotation start====
k5KVwq0uL3RvU3RyaW5nLmpzA8LAlcKvLi91cHBlckZpcnN0LmpzBsLAgadkZWZhdWx0lKFsqmNhcGl0YWxpemUNwJ+XoW8AAAPAkQjAmaFkCQACwJECwMKYoWmodG9TdHJpbmeSAgvAAKdkZWZhdWx0wMCYoXILCMDAkQHAwpyhaQAYAQaQwMIAwsDAmaFkCQAFwJEFwMKYoWmqdXBwZXJGaXJzdJIFCsABp2RlZmF1bHTAwJihcgsKwMCRBMDCnKFpARoEB5DAwgHCwMCXoW8BAAgMkMCZoWQAGgnAkwoLCcDCmKFsqmNhcGl0YWxpemWSCQ7AwMDA2UpXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvY2FwaXRhbGl6ZS5qc5ihcgkKwAqRCMDCmKFyFArAC5EEwMKYoXIBCMDAkQHAwpihZwEDDcCQwMKYoWcJCw7AkQ7AwpihcgAKwMCRCMDC
====catalogjs annotation end====*/