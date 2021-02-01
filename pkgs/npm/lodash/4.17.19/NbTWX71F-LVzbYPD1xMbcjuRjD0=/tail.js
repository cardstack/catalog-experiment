import { default as baseSlice } from "./dist/142.js";
function tail(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseSlice(array, 1, length) : [];
}
export { tail as default };
/*====catalogjs annotation start====
k5GVwq0uL2Rpc3QvMTQyLmpzA8LAgadkZWZhdWx0lKFspHRhaWwJwJuXoW8AAAPAkMCZoWQJAALAkQLAwpihaaliYXNlU2xpY2WSAgfAAKdkZWZhdWx0wMCYoXILCcDAkQHAwpyhaQAYAQSQwMIAwsDAl6FvAQAFCJDAmaFkABoGwJIHBsDCmKFspHRhaWySBgrAwMDA2URXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvdGFpbC5qc5ihcgkEwAeRBcDCmKFyTQnAwJEBwMKYoWcBAwnAkMDCmKFnCQsKwJEKwMKYoXIABMDAkQXAwg==
====catalogjs annotation end====*/