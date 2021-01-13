import { default as toFinite } from "./toFinite.js";
import { default as toNumber } from "./toNumber.js";
var nativeMax = Math.max,
    nativeMin = Math.min;
function baseInRange(number, start, end) {
  return number >= nativeMin(start, end) && number < nativeMax(start, end);
}
function inRange(number, start, end) {
  start = toFinite(start);

  if (end === undefined) {
    end = start;
    start = 0;
  } else {
    end = toFinite(end);
  }

  number = toNumber(number);
  return baseInRange(number, start, end);
}
export { inRange as default };
/*====catalogjs annotation start====
k5KVwq0uL3RvRmluaXRlLmpzA8LAlcKtLi90b051bWJlci5qcwbCwIGnZGVmYXVsdJShbKdpblJhbmdlGcDcABuXoW8AAAPAkg0SwJmhZAkAAsCRAsDCmKFpqHRvRmluaXRlkwIUFcAAp2RlZmF1bHTAwJihcgsIwMCRAcDCnKFpABgBBpDAwgDCwMCZoWQJAAXAkQXAwpihaah0b051bWJlcpIFFsABp2RlZmF1bHTAwJihcgsIwMCRBMDCnKFpARgEB5DAwgHCwMCXoW8BAAgRkMCYoWcAAQkNkMDCmaFkBAsKC5IKCMDCmKFsqW5hdGl2ZU1heJIKEMDAwAjZTFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZUluUmFuZ2UuanOYoXIACcDAkQnAwpmhZAYLDMCSDAjAwpihbKluYXRpdmVNaW6SDA/AwMAI2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJblJhbmdlLmpzmKFyAAnAwJELwMKZoWQBDw7AlQ8QDgsJwMKYoWyrYmFzZUluUmFuZ2WSDhfAwMDA2UxXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2Jhc2VJblJhbmdlLmpzmKFyCQvAD5ENwMKYoXIqCcAQkQvAwpihchkJwMCRCcDCl6FvAQASGJDAmaFkABcTwJUUFRYXE8DCmKFsp2luUmFuZ2WSExrAwMDA2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaW5SYW5nZS5qc5ihcgkHwBSREsDCmKFyIQjAFZEBwMKYoXJaCMAWkQHAwpihchcIwBeRBMDCmKFyEwvAwJENwMKYoWcBAxnAkMDCmKFnCQsawJEawMKYoXIAB8DAkRLAwg==
====catalogjs annotation end====*/