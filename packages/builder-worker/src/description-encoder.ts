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
  ImportDescription,
  ExportDescription,
  isExportAllMarker,
  ExportAllMarker,
  declarationsMap,
} from "./describe-file";
import isEqual from "lodash/isEqual";
import invert from "lodash/invert";
import {
  DeclarationCodeRegion,
  GeneralCodeRegion,
  ImportCodeRegion,
  NamespaceMarker,
  ReferenceCodeRegion,
} from "./code-region";
import { assertNever } from "@catalogjs/shared/util";

const annotationStart = `\n/*====catalogjs annotation start====\n`;
const annotationEnd = `\n====catalogjs annotation end====*/`;
const annotationRegex = /\/\*====catalogjs annotation start====\n(.+)\n====catalogjs annotation end====\*\/\s*$/;
const exportAllMarkerRegex = /^\{([^}]+)\}$/;

const regionTypeShorthand = {
  general: "g",
  reference: "r",
  import: "i",
  declaration: "d",
};

const moduleDescLegend = [
  "imports", // array of import descriptions
  "exports", // [name: string]: array of export descriptions
  "exportRegions", // [[number, number | null]]
  "names", // [name: string]: name desc array
  "regions", // array of code regions
];

const baseCodeRegionLegend = [
  "type", // "r" = "reference", "g" = "general", "i" = "import", "d" = "declaration"
  "start", // number
  "end", // number
  "firstChild", // number | null
  "nextSibling", // number | null
  "shorthand", // "i" = "import" | "e" = "export" | "o" = "object" | false
  "dependsOn", // Set<number>
];

const generalCodeRegionLegend = [
  ...baseCodeRegionLegend,
  "preserveGaps", // boolean
];

const declarationCodeRegionLegend = [...generalCodeRegionLegend, "declaration"];

const importCodeRegionLegend = [
  ...generalCodeRegionLegend,
  "importIndex", // number
];

const referenceCodeRegionLegend = [...baseCodeRegionLegend];

const declarationLegend = [
  "type", // "l" = local, "i" = import
  "declaredName", // string,
  "references", // [number]
  "sideEffects", // number | null
  "original", // [moduleHref: string, exportedName: string ] | null
  "importIndex", // number | null
  "importedName", // string | { n: true }
];

const importDescLegend = [
  "isDynamic", // boolean
  "specifier", // string
  "region", // number | null
  "isReexport", // boolean
  "specifierRegion", // number | null
];

const exportRegionDescLegend = [
  "region", // number
  "declaration", // number
  "defaultExport", // true | "identifier" | undefined
];

const exportDescLegend = [
  "type", // "l" = "local" | "r" = "reexport" | "e" = "export-all"
  "name", // string | { n: true }
  "exportRegion", // number
  "importIndex", // number | null
];

interface Pojo {
  [key: string]: any;
}

export function addDescriptionToSource(
  desc: ModuleDescription,
  source: string
): string {
  return [
    source,
    annotationStart,
    encodeModuleDescription(desc),
    annotationEnd,
  ].join("");
}

export function extractDescriptionFromSource(
  source: string
): { desc: ModuleDescription | undefined; source: string } {
  let match = annotationRegex.exec(source);
  if (match) {
    let desc = decodeModuleDescription(match[1]);
    let unannotatedSource = source.slice(0, source.indexOf(annotationStart));
    return { source: unannotatedSource, desc };
  }
  return { source, desc: undefined };
}

// TODO we can generalize this even farther if we nest the legends, and make
// general rules around how to deal with Maps, Sets, and arrays, and include
// shorthand rules in the legend...
function encodeModuleDescription(desc: ModuleDescription): string {
  let encoded = [];
  for (let prop of moduleDescLegend) {
    switch (prop) {
      case "imports":
        encoded.push(desc.imports.map((i) => encodeObj(i, importDescLegend)));
        break;
      case "exports":
        let exports: Pojo = {};
        for (let [key, val] of desc.exports) {
          if (isExportAllMarker(key)) {
            key = encodeExportAllMarker(key);
          }
          exports[key] = encodeObj(val, exportDescLegend, {
            type: { local: "l", reexport: "r", "export-all": "e" },
          });
        }
        encoded.push(exports);
        break;
      case "exportRegions":
        encoded.push(
          desc.exportRegions.map((r) =>
            encodeObj(r, exportRegionDescLegend, {
              defaultExport: { identifier: "i" },
            })
          )
        );
        break;
      case "regions":
        encoded.push(
          desc.regions.map((r) => {
            switch (r.type) {
              case "general":
                return encodeObj(r, generalCodeRegionLegend, {
                  type: { ...regionTypeShorthand },
                  shorthand: { import: "i", export: "e", object: "o" },
                });
              case "reference":
                return encodeObj(r, referenceCodeRegionLegend, {
                  type: { ...regionTypeShorthand },
                  shorthand: { import: "i", export: "e", object: "o" },
                });
              case "import":
                return encodeObj(r, importCodeRegionLegend, {
                  type: { ...regionTypeShorthand },
                  shorthand: { import: "i", export: "e", object: "o" },
                });
              case "declaration":
                return encodeObj(
                  r,
                  declarationCodeRegionLegend,
                  {
                    type: { ...regionTypeShorthand },
                    shorthand: { import: "i", export: "e", object: "o" },
                  },
                  {
                    declaration: {
                      legend: declarationLegend,
                      shorthand: { type: { import: "i", local: "l" } },
                      encodeProps: {
                        original: {
                          legend: ["moduleHref", "exportedName"],
                        },
                      },
                    },
                  }
                );
              default:
                assertNever(r);
            }
          })
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

function decodeModuleDescription(encoded: string): ModuleDescription {
  let buffer = base64Decode(encoded);
  let encodedDesc = msgpackDecode(buffer) as any[];

  let imports: ModuleDescription["imports"] = [];
  let exports: ModuleDescription["exports"] = new Map();
  let exportRegions: ModuleDescription["exportRegions"] = [];
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
            isEncodedExportAllMarker(key) ? decodeExportAllMarker(key)! : key,
            decodeArray(val, exportDescLegend, {
              type: { local: "l", reexport: "r", "export-all": "e" },
            }) as ExportDescription
          );
        }
        break;
      case "exportRegions":
        exportRegions = value.map((v: any[]) =>
          decodeArray(v, exportRegionDescLegend, {
            defaultExport: { identifier: "i" },
          })
        );
        break;
      case "regions":
        regions = value.map((v: any[]) => {
          let type = decodeRegionType(v[0]);
          switch (type) {
            case "general":
              return decodeArray(
                v,
                generalCodeRegionLegend,
                {
                  type: { ...regionTypeShorthand },
                  shorthand: { import: "i", export: "e", object: "o" },
                },
                { dependsOn: "Set" }
              ) as GeneralCodeRegion;
            case "reference":
              return decodeArray(
                v,
                referenceCodeRegionLegend,
                {
                  type: { ...regionTypeShorthand },
                  shorthand: { import: "i", export: "e", object: "o" },
                },
                { dependsOn: "Set" }
              ) as ReferenceCodeRegion;
            case "import":
              return decodeArray(
                v,
                importCodeRegionLegend,
                {
                  type: { ...regionTypeShorthand },
                  shorthand: { import: "i", export: "e", object: "o" },
                },
                { dependsOn: "Set" }
              ) as ImportCodeRegion;
            case "declaration":
              return decodeArray(
                v,
                declarationCodeRegionLegend,
                {
                  type: { ...regionTypeShorthand },
                  shorthand: { import: "i", export: "e", object: "o" },
                },
                { dependsOn: "Set" },
                {
                  declaration: {
                    legend: declarationLegend,
                    shorthand: { type: { import: "i", local: "l" } },
                    decodeProps: {
                      original: {
                        legend: ["moduleHref", "exportedName"],
                      },
                    },
                  },
                }
              ) as DeclarationCodeRegion;
            default:
              throw new Error(
                `bug: don't know how to decode region type '${type}'`
              );
          }
        });
        break;
      default:
        throw new Error(
          `bug: don't know how to decode ModuleDescription property '${prop}'`
        );
    }
  }

  return {
    imports,
    exports,
    exportRegions,
    declarations: declarationsMap(regions),
    regions,
  };
}

function decodeRegionType(e: string) {
  let [type] =
    Object.entries(regionTypeShorthand)
      .find(([, value]) => value === e)
      ?.map(([key]) => key) ?? [];
  if (!type) {
    throw new Error(`cannot decode region type ${e}`);
  }
  return type;
}

const encodedNamespaceMarker = Object.freeze({ n: true });
function encodeExportAllMarker(marker: ExportAllMarker) {
  return `{${marker.exportAllFrom}}`;
}
function decodeExportAllMarker(encoded: string) {
  let match = encoded.match(exportAllMarkerRegex);
  if (match) {
    return match[1];
  }
  return;
}
function isEncodedExportAllMarker(encoded: string) {
  return Boolean(encoded.match(exportAllMarkerRegex));
}

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
