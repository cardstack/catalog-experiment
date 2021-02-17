import { default as getNative } from "./68.js";
import { default as root } from "./93.js";
import { default as Map0 } from "./66.js";
import { default as Set0 } from "./67.js";
import { default as WeakMap0 } from "./46.js";
import { default as baseGetTag } from "./86.js";
import { default as toSource } from "./109.js";
var DataView0 = getNative(root, 'DataView');
var Promise0 = getNative(root, 'Promise');
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';
var dataViewTag = '[object DataView]';
var dataViewCtorString = toSource(DataView0),
    mapCtorString = toSource(Map0),
    promiseCtorString = toSource(Promise0),
    setCtorString = toSource(Set0),
    weakMapCtorString = toSource(WeakMap0);
var getTag = baseGetTag;
if (DataView0 && getTag(new DataView0(new ArrayBuffer(1))) != dataViewTag || Map0 && getTag(new Map0()) != mapTag || Promise0 && getTag(Promise0.resolve()) != promiseTag || Set0 && getTag(new Set0()) != setTag || WeakMap0 && getTag(new WeakMap0()) != weakMapTag) {
  getTag = function (value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag;

        case mapCtorString:
          return mapTag;

        case promiseCtorString:
          return promiseTag;

        case setCtorString:
          return setTag;

        case weakMapCtorString:
          return weakMapTag;
      }
    }

    return result;
  };
}
export { getTag as default };
/*====catalogjs annotation start====
k5eVwqcuLzY4LmpzA8LAlcKnLi85My5qcwfCwJXCpy4vNjYuanMLwsCVwqcuLzY3LmpzD8LAlcKnLi80Ni5qcxPCwJXCpy4vODYuanMXwsCVwqguLzEwOS5qcxvCwIGnZGVmYXVsdJWhbKZnZXRUYWd8wMDcAH6XoW8AAAPAkx8mWMCZoWQJAAIEkQLAwpmhaalnZXROYXRpdmWTAiIpwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpAAEBB5EEwMIAwsDAmKFnCAnAwJDAwpmhZAkABgiRBsDCmaFppHJvb3STBiMqwAGnZGVmYXVsdMDAwJihcgsEwMCRBcDCnKFpAQEFC5EIwMIBwsDAmKFnCAnAwJDAwpmhZAkACgyRCsDCmaFppE1hcDCUCkRdX8ACp2RlZmF1bHTAwMCYoXILBMDAkQnAwpyhaQEBCQ+RDMDCAsLAwJihZwgJwMCQwMKZoWQJAA4QkQ7AwpmhaaRTZXQwlA5OZWfAA6dkZWZhdWx0wMDAmKFyCwTAwJENwMKcoWkBAQ0TkRDAwgPCwMCYoWcICcDAkMDCmaFkCQASFJESwMKZoWmoV2Vha01hcDCUElNpa8AEp2RlZmF1bHTAwMCYoXILCMDAkRHAwpyhaQEBEReRFMDCBMLAwJihZwgJwMCQwMKZoWQJABYYkRbAwpmhaapiYXNlR2V0VGFnkxZXbsAFp2RlZmF1bHTAwMCYoXILCsDAkRXAwpyhaQEBFRuRGMDCBcLAwJihZwgJwMCQwMKZoWQJABockRrAwpmhaah0b1NvdXJjZZcaPkNITVJwwAanZGVmYXVsdMDAwJihcgsIwMCRGcDCnKFpAQEZHZEcwMIGwsDAmKFnCArAwJDAwpehbwEAHiSQwJihZwABH8CQwMKZoWQEACDAkyAeIcDCmaFsqURhdGFWaWV3MJQgP1lbwMDAHpDZSVducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fRGF0YVZpZXcuanOYoXIACcAhkR/AwpihZwMNIsCSIiPAwpihcgAJwCORAcDCmKFyAQTAwJEFwMKXoW8BACUrkMCYoWcAASbAkMDCmaFkBAAnwJMnJSjAwpmhbKhQcm9taXNlMJQnSWFjwMDAJZDZSFducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fUHJvbWlzZS5qc5ihcgAIwCiRJsDCmKFnAwwpwJIpKsDCmKFyAAnAKpEBwMKYoXIBBMDAkQXAwpehbwEALHuQwJihZwABLTeQwMKZoWQEES4vki4swMKZoWymbWFwVGFnky5gdMDAwCyRWNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19nZXRUYWcuanOYoXIABsDAkS3AwpmhZAYUMDGSMCzAwpmhbKlvYmplY3RUYWeSMG/AwMAskVjZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZ2V0VGFnLmpzmKFyAAnAwJEvwMKZoWQGFTIzkjIswMKZoWyqcHJvbWlzZVRhZ5MyZHbAwMAskVjZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZ2V0VGFnLmpzmKFyAArAwJExwMKZoWQGETQ1kjQswMKZoWymc2V0VGFnkzRoeMDAwCyRWNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19nZXRUYWcuanOYoXIABsDAkTPAwpmhZAYVNsCSNizAwpmhbKp3ZWFrTWFwVGFnkzZsesDAwCyRWNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19nZXRUYWcuanOYoXIACsDAkTXAwpihZwEBODqQwMKZoWQEFjnAkjk3wMKZoWyrZGF0YVZpZXdUYWeTOVxywMDAN5FY2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldFRhZy5qc5ihcgALwMCROMDCmKFnAQE7VJDAwpmhZAQAPECTPDo9wMKZoWyyZGF0YVZpZXdDdG9yU3RyaW5nkjxxwMDAOpFY2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldFRhZy5qc5ihcgASwD2RO8DCmKFnAwE+wJI+P8DCmKFyAAjAP5EZwMKYoXIBCcDAkR/AwpmhZAYAQUWTQTpCwMKZoWytbWFwQ3RvclN0cmluZ5JBc8DAwDqRWNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19nZXRUYWcuanOYoXIADcBCkUDAwpihZwMBQ8CSQ0TAwpihcgAIwESRGcDCmKFyAQTAwJEJwMKZoWQGAEZKk0Y6R8DCmaFssXByb21pc2VDdG9yU3RyaW5nkkZ1wMDAOpFY2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldFRhZy5qc5ihcgARwEeRRcDCmKFnAwFIwJJIScDCmKFyAAjASZEZwMKYoXIBCMDAkSbAwpmhZAYAS0+TSzpMwMKZoWytc2V0Q3RvclN0cmluZ5JLd8DAwDqRWNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19nZXRUYWcuanOYoXIADcBMkUrAwpihZwMBTcCSTU7AwpihcgAIwE6RGcDCmKFyAQTAwJENwMKZoWQGAFDAk1A6UcDCmaFssXdlYWtNYXBDdG9yU3RyaW5nklB5wMDAOpFY2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldFRhZy5qc5ihcgARwFGRT8DCmKFnAwFSwJJSU8DCmKFyAAjAU5EZwMKYoXIBCMDAkRHAwpihZwEBVViQwMKZoWQEAFbAk1dWVMDCmaFspmdldFRhZ5hWWl5iZmptfcDAwFSRWNlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19nZXRUYWcuanOYoXIABsBXkVXAwpihcgMKwMCRFcDCmKFnASpZwNwAIllaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXrAw5ihcgQJwFqRH8DCmKFyBAbAW5FVwMKYoXIFCcBckR/AwpihchkLwF2ROMDCmKFyBATAXpEJwMKYoXIEBsBfkVXAwpihcgUEwGCRCcDCmKFyBwbAYZEtwMKYoXIECMBikSbAwpihcgQGwGORVcDCmKFyAQjAZJEmwMKYoXIPCsBlkTHAwpihcgQEwGaRDcDCmKFyBAbAZ5FVwMKYoXIFBMBokQ3AwpihcgcGwGmRM8DCmKFyBAjAapERwMKYoXIEBsBrkVXAwpihcgUIwGyREcDCmKFyBwrAbZE1wMKYoXIGBsBukVXAwpihcicKwG+RFcDCmKFyIgnAcJEvwMKYoXI+CMBxkRnAwpihck0SwHKRO8DCmKFyEwvAc5E4wMKYoXIQDcB0kUDAwpihchMGwHWRLcDCmKFyEBHAdpFFwMKYoXITCsB3kTHAwpihchANwHiRSsDCmKFyEwbAeZEzwMKYoXIQEcB6kU/AwpihchMKwMCRNcDCmKFnAQN8wJDAwpihZwkLfcCRfcDCmKFyAAbAwJFVwMI=
====catalogjs annotation end====*/