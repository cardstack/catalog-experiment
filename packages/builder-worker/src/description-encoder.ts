// TODO move all of this out into a utility module

import {
  encode as msgpackEncode,
  decode as msgpackDecode,
} from "@msgpack/msgpack";
import {
  encode as base64Encode,
  decode as base64Decode,
} from "base64-arraybuffer";
import {
  ModuleDescription,
  NamespaceMarker,
  ImportDescription,
  ExportDescription,
  LocalNameDescription,
  ImportedNameDescription,
} from "./describe-file";
import isEqual from "lodash/isEqual";
import invert from "lodash/invert";
import { CodeRegion } from "./code-region";
import { assertNever } from "@catalogjs/shared/util";

const moduleDescLegend = [
  "imports", // array of import descriptions
  "exports", // [name: string]: array of export descriptions
  "exportRegions", // [[number, number | null]]
  "names", // [name: string]: name desc array
  "regions", // array of code regions
];

const codeRegionLegend = [
  "start", // number
  "end", // number
  "firstChild", // number | null
  "nextSibling", // number | null
  "shorthand", // "i" = "import" | "e" = "export" | "o" = "object" | false
  "preserveGaps", // boolean
];

const importDescLegend = [
  "isDynamic", // boolean
  "specifier", // string
  "region", // number | null
];

const exportRegionDescLegend = [
  "region", // number
  "declaration", // number
  "isDefaultExport", // boolean
];

const exportDescLegend = [
  "type", // "l" = "local" | "r" = "reexport"
  "name", // string | { n: true }
  "exportRegion", // number
  "importIndex", // number | null
];

const nameDescLegend = [
  "type", // "l" = local, "i" = import, "r" = require
  "dependsOn", // string[]
  "usedByModule", // boolean
  "declaration", // number
  "declarationSideEffects", // number | null
  "references", // number[]
  "original", // [moduleHref: string, exportedName: string | { n:true} ]
  "importIndex", // number
  "requireIndex", // number
  "name", // string | { n: true }
  "bindingsConsumedByDeclarationSideEffects", // string[]
];

interface Pojo {
  [key: string]: any;
}

// TODO we can generalize this even farther if we nest the legends, and make
// general rules around how to deal with Maps, Sets, and arrays, and include
// shorthand rules in the legend...
export function encodeModuleDescription(desc: ModuleDescription): string {
  let encoded = [];
  for (let prop of moduleDescLegend) {
    switch (prop) {
      case "imports":
        encoded.push(desc.imports.map((i) => encodeObj(i, importDescLegend)));
        break;
      case "exports":
        let exports: Pojo = {};
        for (let [key, val] of desc.exports) {
          exports[key] = encodeObj(val, exportDescLegend, {
            type: { local: "l", reexport: "r" },
          });
        }
        encoded.push(exports);
        break;
      case "exportRegions":
        encoded.push(
          desc.exportRegions.map((r) => encodeObj(r, exportRegionDescLegend))
        );
        break;
      case "names":
        let names: Pojo = {};
        for (let [key, val] of desc.names) {
          names[key] = encodeObj(
            val,
            nameDescLegend,
            {
              type: { local: "l", import: "i" },
            },
            {
              original: {
                legend: ["moduleHref", "exportedName"],
              },
            }
          );
        }
        encoded.push(names);
        break;
      case "regions":
        encoded.push(
          desc.regions.map((r) =>
            encodeObj(r, codeRegionLegend, {
              shorthand: { import: "i", export: "e", object: "o" },
            })
          )
        );
        break;
      default:
        throw new Error(
          `bug: don't know how to encode ModuleDescription property '${prop}'`
        );
    }
  }
  return base64Encode(msgpackEncode(encoded));
}

export function decodeModuleDescription(encoded: string): ModuleDescription {
  let buffer = base64Decode(encoded);
  let encodedDesc = msgpackDecode(buffer) as any[];

  let imports: ModuleDescription["imports"] = [];
  let exports: ModuleDescription["exports"] = new Map();
  let exportRegions: ModuleDescription["exportRegions"] = [];
  let names: ModuleDescription["names"] = new Map();
  let regions: ModuleDescription["regions"] = [];

  for (let [index, prop] of moduleDescLegend.entries()) {
    let value = encodedDesc[index];
    switch (prop) {
      case "imports":
        imports = value.map(
          (v: any[]) => decodeArray(v, importDescLegend) as ImportDescription
        );
        break;
      case "exports":
        for (let [key, val] of Object.entries(value)) {
          if (!Array.isArray(val)) {
            throw new Error(
              `bug: expecting object value to be an array but it wasn't`
            );
          }
          exports.set(
            key,
            decodeArray(val, exportDescLegend, {
              type: { local: "l", reexport: "r" },
            }) as ExportDescription
          );
        }
        break;
      case "exportRegions":
        exportRegions = value.map((v: any[]) =>
          decodeArray(v, exportRegionDescLegend)
        );
        break;
      case "names":
        for (let [key, val] of Object.entries(value)) {
          if (!Array.isArray(val)) {
            throw new Error(
              `bug: expecting object value to be an array but it wasn't`
            );
          }
          names.set(
            key,
            decodeArray(
              val,
              nameDescLegend,
              {
                type: { local: "l", import: "i" },
              },
              {
                dependsOn: "Set",
                bindingsConsumedByDeclarationSideEffects: "Set",
              },
              {
                original: {
                  legend: ["moduleHref", "exportedName"],
                },
              }
            ) as LocalNameDescription | ImportedNameDescription
          );
        }
        break;
      case "regions":
        regions = value.map(
          (v: any[]) =>
            decodeArray(v, codeRegionLegend, {
              shorthand: { import: "i", export: "e", object: "o" },
            }) as CodeRegion
        );
        break;
      default:
        throw new Error(
          `bug: don't know how to encode ModuleDescription property '${prop}'`
        );
    }
  }

  return {
    imports,
    exports,
    exportRegions,
    names,
    regions,
  };
}

const encodedNamespaceMarker = Object.freeze({ n: true });

interface Shorthand {
  [prop: string]: { [name: string]: string };
}

interface EncodeProps {
  [prop: string]: {
    legend: string[];
    shorthand?: Shorthand;
    encodeProps?: EncodeProps;
  };
}

interface DecodeProps {
  [prop: string]: {
    legend: string[];
    shorthand?: Shorthand;
    typeHints?: TypeHints;
    decodeProps?: DecodeProps;
  };
}

interface TypeHints {
  [prop: string]: "Set"; // add more as necessary
}

function decodeArray(
  arr: any[],
  legend: string[],
  shorthand?: Shorthand,
  typeHints?: TypeHints,
  decodeProps?: DecodeProps
) {
  let obj: Pojo = {};
  for (let [index, val] of arr.entries()) {
    let prop = legend[index];
    if (Array.isArray(val) && decodeProps && prop in decodeProps) {
      val = decodeArray(
        val,
        decodeProps[prop].legend,
        decodeProps[prop].shorthand,
        decodeProps[prop].typeHints,
        decodeProps[prop].decodeProps
      );
    } else if (typeHints && prop in typeHints) {
      let type = typeHints[prop];
      switch (type) {
        case "Set":
          val = new Set(val);
          break;
        default:
          throw assertNever(type);
      }
    } else if (shorthand && prop in shorthand && typeof val === "string") {
      val = (invert(shorthand[prop]) as Pojo)[val];
    }
    obj[prop] = decodeVal(val);
  }
  return obj;
}

function decodeVal(val: any) {
  if (val == null) {
    return undefined;
  }
  if (isEqual(val, encodedNamespaceMarker)) {
    return NamespaceMarker;
  }
  return val;
}

function encodeObj(
  obj: Pojo,
  legend: string[],
  shorthand?: Shorthand,
  encodeProps?: EncodeProps
) {
  return legend.map((k) => {
    let value = obj[k];
    if (value instanceof Set) {
      value = [...value];
    }
    if (typeof value === "object" && encodeProps && k in encodeProps) {
      value = encodeObj(
        value,
        encodeProps[k].legend,
        encodeProps[k].shorthand,
        encodeProps[k].encodeProps
      );
    } else if (shorthand && k in shorthand) {
      value = typeof value === "string" ? shorthand[k][value] : value;
    }
    return jsonSafe(value);
  });
}

function jsonSafe(val: any) {
  if (val == null) {
    return null;
  }
  if (val === NamespaceMarker) {
    return encodedNamespaceMarker;
  }

  return val;
}
