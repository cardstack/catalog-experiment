import constants from "./constants";

const utf8 = new TextDecoder("utf-8");
export const recordSize = 512;
export const defaultFileMode = constants.TPERMALL; // rwxrwxrwx
export const defaultUid = 0; // root
export const defaultGid = 0; // root

/*
 struct posix_header {           // byte offset
 char name[100];               //   0
 char mode[8];                 // 100
 char uid[8];                  // 108
 char gid[8];                  // 116
 char size[12];                // 124
 char mtime[12];               // 136
 char chksum[8];               // 148
 char typeflag;                // 156
 char linkname[100];           // 157
 char magic[6];                // 257
 char version[2];              // 263
 char uname[32];               // 265
 char gname[32];               // 297
 char devmajor[8];             // 329
 char devminor[8];             // 337
 char prefix[131];             // 345
 char atime[12];               // 476
 char ctime[12];               // 488
 };
 */

interface BaseFileEntry {
  name: string;
  mode?: number;
  uid?: number;
  gid?: number;
  modifyTime?: number | string | Date;
  type?: number | string;
  owner?: string;
  group?: string;
  prefix?: string;
  accessTime?: number | string | Date;
  createTime?: number | string | Date;
}

export interface StreamFileEntry extends BaseFileEntry {
  stream: ReadableStream<Uint8Array>;
  size: number;
}

export interface BufferFileEntry extends BaseFileEntry {
  data: Uint8Array;
}

export type FileEntry = StreamFileEntry | BufferFileEntry;

type PosixHeader = [
  string,
  number,
  number,
  (file: FileEntry, field: PosixHeader) => string,
  (buffer: Uint8Array, offset: number, field: PosixHeader) => unknown
];

export const posixHeader: PosixHeader[] = [
  // <field name>, <size>, <offset>, <used>, <format>, <parse>, [ <check> ]
  [
    "name",
    100,
    0,
    function(file, field) {
      return formatTarString(file.name, field[1]);
    },
    function(buffer, offset, field) {
      return parseTarString(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "mode",
    8,
    100,
    function(file, field) {
      let mode = file.mode || defaultFileMode;
      mode = mode & constants.TPERMMASK;
      return formatTarNumber(mode, field[1], defaultFileMode);
    },
    function(buffer, offset, field) {
      let result = parseTarNumber(buffer.slice(offset, offset + field[1]));
      result &= constants.TPERMMASK;
      return result;
    },
  ],
  [
    "uid",
    8,
    108,
    function(file, field) {
      return formatTarNumber(file.uid, field[1], defaultUid);
    },
    function(buffer, offset, field) {
      return parseTarNumber(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "gid",
    8,
    116,
    function(file, field) {
      return formatTarNumber(file.gid, field[1], defaultGid);
    },
    function(buffer, offset, field) {
      return parseTarNumber(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "size",
    12,
    124,
    function(file, field) {
      let size: number;
      if ("stream" in file) {
        size = file.size;
      } else {
        size = file.data.length;
      }
      return formatTarNumber(size, field[1]);
    },
    function(buffer, offset, field) {
      return parseTarNumber(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "modifyTime",
    12,
    136,
    function(file, field) {
      return formatTarDateTime(file.modifyTime, field[1]);
    },
    function(buffer, offset, field) {
      return parseTarDateTime(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "checksum",
    8,
    148,
    function(_file, _field) {
      return "        "; // placeholder
    },
    function(buffer, offset, field) {
      return parseTarNumber(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "type",
    1,
    156,
    function(file, _field) {
      // get last octal digit; 0 - regular file
      return "" + (toNumberWithDefault(file.type, 0) % 8);
    },
    function(buffer, offset, _field) {
      return (parseInt(String.fromCharCode(buffer[offset]), 10) || 0) % 8;
    },
  ],
  [
    "linkName",
    100,
    157,
    function(_file, _field) {
      return ""; // only regular files are supported
    },
    function(buffer, offset, field) {
      return parseTarString(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "ustar",
    8,
    257,
    function(_file, _field) {
      return constants.TMAGIC; // magic + version
    },
    function(buffer, offset, field) {
      return fixUstarMagic(
        parseTarString(buffer.slice(offset, offset + field[1]), true)
      );
    },
    // function(file, field) {
    //   return (
    //     file.ustar == constants.TMAGIC || file.ustar == constants.OLDGNU_MAGIC
    //   );
    // },
  ],
  [
    "owner",
    32,
    265,
    function(file, field) {
      return formatTarString(file.owner, field[1]);
    },
    function(buffer, offset, field) {
      return parseTarString(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "group",
    32,
    297,
    function(file, field) {
      return formatTarString(file.group, field[1]);
    },
    function(buffer, offset, field) {
      return parseTarString(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "majorNumber",
    8,
    329,
    function(_file, _field) {
      return ""; // only regular files are supported
    },
    function(buffer, offset, field) {
      return parseTarNumber(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "minorNumber",
    8,
    337,
    function(_file, _field) {
      return ""; // only regular files are supported
    },
    function(buffer, offset, field) {
      return parseTarNumber(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "prefix",
    131,
    345,
    function(file, field) {
      return formatTarString(file.prefix, field[1]);
    },
    function(buffer, offset, field) {
      return parseTarString(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "accessTime",
    12,
    476,
    function(file, field) {
      return formatTarDateTime(file.accessTime, field[1]);
    },
    function(buffer, offset, field) {
      return parseTarDateTime(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "createTime",
    12,
    488,
    function(file, field) {
      return formatTarDateTime(file.createTime, field[1]);
    },
    function(buffer, offset, field) {
      return parseTarDateTime(buffer.slice(offset, offset + field[1]));
    },
  ],
];

export const effectiveHeaderSize = (function(header) {
  let last = header[header.length - 1];
  return last[2] + last[1]; // offset + size
})(posixHeader);

function fixUstarMagic(value: string) {
  if (value.length == 8) {
    let chars = value.split("");

    if (chars[5] == constants.NULL_CHAR) {
      // TMAGIC ?
      if (chars[6] == " " || chars[6] == constants.NULL_CHAR) {
        chars[6] = "0";
      }
      if (chars[7] == " " || chars[7] == constants.NULL_CHAR) {
        chars[7] = "0";
      }
      let joinedChars = chars.join("");
      return joinedChars == constants.TMAGIC ? joinedChars : value;
    } else if (chars[7] == constants.NULL_CHAR) {
      // OLDGNU_MAGIC ?
      if (chars[5] == constants.NULL_CHAR) {
        chars[5] = " ";
      }
      if (chars[6] == constants.NULL_CHAR) {
        chars[6] = " ";
      }
      let joinedChars = chars.join("");
      return joinedChars == constants.OLDGNU_MAGIC ? joinedChars : value;
    }
  }
  return value;
}

export function formatTarString(
  value: string | undefined,
  length: number
): string {
  length -= 1; // preserve space for trailing null-char
  if (value === undefined) {
    value = "";
  }
  value = ("" + value).substr(0, length);
  return value + constants.NULL_CHAR;
}

export function formatTarNumber(
  value: number | string | undefined,
  length: number,
  _defaultValue?: string | number
): string {
  let defaultValue = toNumberWithDefault(_defaultValue, 0);
  length -= 1; // preserve space for trailing null-char
  let valueAsNumber = toNumberWithDefault(value, defaultValue);
  let valueAsString = valueAsNumber.toString(8).substr(-length, length);
  while (valueAsString.length < length) {
    valueAsString = "0" + valueAsString;
  }
  return valueAsString + constants.NULL_CHAR;
}

function toNumberWithDefault(
  value: string | number | undefined,
  defaultValue: number
) {
  if (value === undefined) {
    return defaultValue;
  } else if (typeof value === "string") {
    return parseInt(value);
  } else {
    return value;
  }
}

export function formatTarDateTime(
  value: Date | number | string | undefined,
  length: number
): string {
  let valueAsNumber: number;
  if (value instanceof Date) {
    valueAsNumber = Math.floor(value.getTime() / 1000);
  } else {
    if (typeof value === "string") {
      valueAsNumber = parseInt(value, 10);
    } else if (typeof value === "number" && isFinite(value)) {
      valueAsNumber = value;
    } else {
      valueAsNumber = Math.floor(Date.now() / 1000);
    }
  }
  return formatTarNumber(valueAsNumber, length, 0);
}

export function parseTarString(
  bytes: Uint8Array,
  returnUnprocessed = false
): string {
  let result = utf8.decode(bytes);
  if (returnUnprocessed) {
    return result;
  }
  let index = result.indexOf(constants.NULL_CHAR);
  return index >= 0 ? result.substr(0, index) : result;
}

export function parseTarNumber(bytes: Uint8Array) {
  let result = utf8.decode(bytes);
  return parseInt(result.replace(/^0+$/g, ""), 8) || 0;
}

export function parseTarDateTime(bytes: Uint8Array) {
  if (bytes.length == 0 || bytes[0] == 0) {
    return null;
  }
  return new Date(1000 * parseTarNumber(bytes));
}

export function calculateChecksum(
  buffer: Uint8Array,
  from: number,
  skipChecksum: boolean
) {
  let to = Math.min(from + effectiveHeaderSize, buffer.length);
  let result = 0;

  // When calculating checksum, `checksum` field should be
  // threat as filled with space char (byte 32)
  let skipFrom = 0;
  let skipTo = 0;
  if (skipChecksum) {
    posixHeader.every(function(field) {
      if (field[0] == "checksum") {
        skipFrom = from + field[2];
        skipTo = skipFrom + field[1];
        return false;
      }
      return true;
    });
  }

  let whitespace = " ".charCodeAt(0);
  for (let i = from; i < to; i++) {
    // 262144 = 8^6 - 6 octal digits - maximum possible value for checksum;
    // wrap to avoid numeric overflow
    let byte = i >= skipFrom && i < skipTo ? whitespace : buffer[i];
    result = (result + byte) % 262144;
  }
  return result;
}
