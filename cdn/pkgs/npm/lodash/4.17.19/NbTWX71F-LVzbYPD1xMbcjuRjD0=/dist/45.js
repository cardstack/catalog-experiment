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
k5eVwqcuLzY4LmpzA8LAlcKnLi85My5qcwbCwJXCpy4vNjYuanMJwsCVwqcuLzY3LmpzDMLAlcKnLi80Ni5qcw/CwJXCpy4vODYuanMSwsCVwqguLzEwOS5qcxXCwIGnZGVmYXVsdJWhbKZnZXRUYWd1wMDcAHeXoW8AAAPAkxgfUcCZoWQJAALAkQLAwpmhaalnZXROYXRpdmWTAhsiwACnZGVmYXVsdMDAwJihcgsJwMCRAcDCnKFpABIBBpDAwgDCwMCZoWQJAAXAkQXAwpmhaaRyb290kwUcI8ABp2RlZmF1bHTAwMCYoXILBMDAkQTAwpyhaQESBAmQwMIBwsDAmaFkCQAIwJEIwMKZoWmkTWFwMJQIPVZYwAKnZGVmYXVsdMDAwJihcgsEwMCRB8DCnKFpARIHDJDAwgLCwMCZoWQJAAvAkQvAwpmhaaRTZXQwlAtHXmDAA6dkZWZhdWx0wMDAmKFyCwTAwJEKwMKcoWkBEgoPkMDCA8LAwJmhZAkADsCRDsDCmaFpqFdlYWtNYXAwlA5MYmTABKdkZWZhdWx0wMDAmKFyCwjAwJENwMKcoWkBEg0SkMDCBMLAwJmhZAkAEcCREcDCmaFpqmJhc2VHZXRUYWeTEVBnwAWnZGVmYXVsdMDAwJihcgsKwMCREMDCnKFpARIQFZDAwgXCwMCZoWQJABTAkRTAwpmhaah0b1NvdXJjZZcUNzxBRktpwAanZGVmYXVsdMDAwJihcgsIwMCRE8DCnKFpARMTFpDAwgbCwMCXoW8BABcdkMCYoWcAARjAkMDCmaFkBAAZwJMZFxrAwpmhbKlEYXRhVmlldzCUGThSVMDAwBeQ2UlXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX0RhdGFWaWV3LmpzmKFyAAnAGpEYwMKYoWcDDRvAkhscwMKYoXIACcAckQHAwpihcgEEwMCRBMDCl6FvAQAeJJDAmKFnAAEfwJDAwpmhZAQAIMCTIB4hwMKZoWyoUHJvbWlzZTCUIEJaXMDAwB6Q2UhXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX1Byb21pc2UuanOYoXIACMAhkR/AwpihZwMMIsCSIiPAwpihcgAJwCORAcDCmKFyAQTAwJEEwMKXoW8BACV0kMCYoWcAASYwkMDCmaFkBBEnKJInJcDCmaFspm1hcFRhZ5MnWW3AwMAlkVHZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZ2V0VGFnLmpzmKFyAAbAwJEmwMKZoWQGFCkqkiklwMKZoWypb2JqZWN0VGFnkilowMDAJZFR2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldFRhZy5qc5ihcgAJwMCRKMDCmaFkBhUrLJIrJcDCmaFsqnByb21pc2VUYWeTK11vwMDAJZFR2UdXbnBtL2xvZGFzaC80LjE3LjE5LzdLQTk4LW9HNjRKYzRKdFZ0Tk9qaTlwOVI0ST0vX19idWlsZF9zcmMvX2dldFRhZy5qc5ihcgAKwMCRKsDCmaFkBhEtLpItJcDCmaFspnNldFRhZ5MtYXHAwMAlkVHZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZ2V0VGFnLmpzmKFyAAbAwJEswMKZoWQGFS/Aki8lwMKZoWyqd2Vha01hcFRhZ5MvZXPAwMAlkVHZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZ2V0VGFnLmpzmKFyAArAwJEuwMKYoWcBATEzkMDCmaFkBBYywJIyMMDCmaFsq2RhdGFWaWV3VGFnkzJVa8DAwDCRUdlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19nZXRUYWcuanOYoXIAC8DAkTHAwpihZwEBNE2QwMKZoWQEADU5kzUzNsDCmaFssmRhdGFWaWV3Q3RvclN0cmluZ5I1asDAwDORUdlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19nZXRUYWcuanOYoXIAEsA2kTTAwpihZwMBN8CSNzjAwpihcgAIwDiRE8DCmKFyAQnAwJEYwMKZoWQGADo+kzozO8DCmaFsrW1hcEN0b3JTdHJpbmeSOmzAwMAzkVHZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZ2V0VGFnLmpzmKFyAA3AO5E5wMKYoWcDATzAkjw9wMKYoXIACMA9kRPAwpihcgEEwMCRB8DCmaFkBgA/Q5M/M0DAwpmhbLFwcm9taXNlQ3RvclN0cmluZ5I/bsDAwDORUdlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19nZXRUYWcuanOYoXIAEcBAkT7AwpihZwMBQcCSQULAwpihcgAIwEKRE8DCmKFyAQjAwJEfwMKZoWQGAERIk0QzRcDCmaFsrXNldEN0b3JTdHJpbmeSRHDAwMAzkVHZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZ2V0VGFnLmpzmKFyAA3ARZFDwMKYoWcDAUbAkkZHwMKYoXIACMBHkRPAwpihcgEEwMCRCsDCmaFkBgBJwJNJM0rAwpmhbLF3ZWFrTWFwQ3RvclN0cmluZ5JJcsDAwDORUdlHV25wbS9sb2Rhc2gvNC4xNy4xOS83S0E5OC1vRzY0SmM0SnRWdE5Pamk5cDlSNEk9L19fYnVpbGRfc3JjL19nZXRUYWcuanOYoXIAEcBKkUjAwpihZwMBS8CSS0zAwpihcgAIwEyRE8DCmKFyAQjAwJENwMKYoWcBAU5RkMDCmaFkBABPwJNQT03AwpmhbKZnZXRUYWeYT1NXW19jZnbAwMBNkVHZR1ducG0vbG9kYXNoLzQuMTcuMTkvN0tBOTgtb0c2NEpjNEp0VnROT2ppOXA5UjRJPS9fX2J1aWxkX3NyYy9fZ2V0VGFnLmpzmKFyAAbAUJFOwMKYoXIDCsDAkRDAwpihZwEqUsDcACJSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzwMOYoXIECcBTkRjAwpihcgQGwFSRTsDCmKFyBQnAVZEYwMKYoXIZC8BWkTHAwpihcgQEwFeRB8DCmKFyBAbAWJFOwMKYoXIFBMBZkQfAwpihcgcGwFqRJsDCmKFyBAjAW5EfwMKYoXIEBsBckU7AwpihcgEIwF2RH8DCmKFyDwrAXpEqwMKYoXIEBMBfkQrAwpihcgQGwGCRTsDCmKFyBQTAYZEKwMKYoXIHBsBikSzAwpihcgQIwGORDcDCmKFyBAbAZJFOwMKYoXIFCMBlkQ3AwpihcgcKwGaRLsDCmKFyBgbAZ5FOwMKYoXInCsBokRDAwpihciIJwGmRKMDCmKFyPgjAapETwMKYoXJNEsBrkTTAwpihchMLwGyRMcDCmKFyEA3AbZE5wMKYoXITBsBukSbAwpihchARwG+RPsDCmKFyEwrAcJEqwMKYoXIQDcBxkUPAwpihchMGwHKRLMDCmKFyEBHAc5FIwMKYoXITCsDAkS7AwpihZwEDdcCQwMKYoWcJC3bAkXbAwpihcgAGwMCRTsDC
====catalogjs annotation end====*/