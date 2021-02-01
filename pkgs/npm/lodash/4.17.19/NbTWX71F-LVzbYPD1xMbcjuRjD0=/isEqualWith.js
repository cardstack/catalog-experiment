import { default as baseIsEqual } from "./dist/43.js";
function isEqualWith(value, other, customizer) {
  customizer = typeof customizer == 'function' ? customizer : undefined;
  var result = customizer ? customizer(value, other) : undefined;
  return result === undefined ? baseIsEqual(value, other, undefined, customizer) : !!result;
}
export { isEqualWith as default };
/*====catalogjs annotation start====
k5GVwqwuL2Rpc3QvNDMuanMDwsCBp2RlZmF1bHSUoWyraXNFcXVhbFdpdGgJwJuXoW8AAAPAkMCZoWQJAALAkQLAwpihaatiYXNlSXNFcXVhbJICB8AAp2RlZmF1bHTAwJihcgsLwMCRAcDCnKFpABcBBJDAwgDCwMCXoW8BAAUIkMCZoWQAMwbAkgcGwMKYoWyraXNFcXVhbFdpdGiSBgrAwMDA2UtXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvaXNFcXVhbFdpdGguanOYoXIJC8AHkQXAwpihcszIC8DAkQHAwpihZwEDCcCQwMKYoWcJCwrAkQrAwpihcgALwMCRBcDC
====catalogjs annotation end====*/