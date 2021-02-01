import { default as baseGet } from "./dist/14.js";
import { default as baseProperty } from "./dist/156.js";
import { default as isKey } from "./dist/26.js";
import { default as toKey } from "./dist/27.js";
function basePropertyDeep(path) {
  return function (object) {
    return baseGet(object, path);
  };
}
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}
export { property as default };
/*====catalogjs annotation start====
k5SVwqwuL2Rpc3QvMTQuanMDwsCVwq0uL2Rpc3QvMTU2LmpzBsLAlcKsLi9kaXN0LzI2LmpzCcLAlcKsLi9kaXN0LzI3LmpzDMLAgadkZWZhdWx0lKFsqHByb3BlcnR5GcDcABuXoW8AAAPAkMCZoWQJAALAkQLAwpihaadiYXNlR2V0kgIQwACnZGVmYXVsdMDAmKFyCwfAwJEBwMKcoWkAFwEGkMDCAMLAwJmhZAkABcCRBcDCmKFprGJhc2VQcm9wZXJ0eZIFFcABp2RlZmF1bHTAwJihcgsMwMCRBMDCnKFpARgECZDAwgHCwMCZoWQJAAjAkQjAwpihaaVpc0tleZIIFMACp2RlZmF1bHTAwJihcgsFwMCRB8DCnKFpARcHDJDAwgLCwMCZoWQJAAvAkQvAwpihaaV0b0tleZILFsADp2RlZmF1bHTAwJihcgsFwMCRCsDCnKFpARcKDZDAwgPCwMCXoW8BAA4RkMCZoWQAFg/AkhAPwMKYoWywYmFzZVByb3BlcnR5RGVlcJIPF8DAwMDZUVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fYmFzZVByb3BlcnR5RGVlcC5qc5ihcgkQwBCRDsDCmKFyMQfAwJEBwMKXoW8BABIYkMCZoWQACRPAlRQVFhcTwMKYoWyocHJvcGVydHmSExrAwMDA2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvcHJvcGVydHkuanOYoXIJCMAUkRLAwpihchIFwBWRB8DCmKFyCQzAFpEEwMKYoXIBBcAXkQrAwpihcgoQwMCRDsDCmKFnAQMZwJDAwpihZwkLGsCRGsDCmKFyAAjAwJESwMI=
====catalogjs annotation end====*/