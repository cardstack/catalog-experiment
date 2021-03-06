import {
  NULL_CHAR,
  TMAGIC,
  OLDGNU_MAGIC,
  TPERMMASK,
  TPERMALL,
} from "./constants";
const utf8 = new TextDecoder("utf-8");
export const recordSize = 512;
export const defaultFileMode = TPERMALL; // rwxrwxrwx
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

export interface BaseFileEntry {
  name: string;
  mode: number;
  modifyTime: number;
  uid?: number;
  gid?: number;
  type?: number;
  owner?: string;
  group?: string;
  prefix?: string;
  accessTime?: number;
  createTime?: number;
}

export interface Header extends Required<BaseFileEntry> {
  size: number;
  checksum: number;
  linkName: string;
  ustar: string;
  majorNumber: number;
  minorNumber: number;
}

export interface StreamFileEntry extends BaseFileEntry {
  stream: () => ReadableStream<Uint8Array>;
  size: number;
}

export interface BufferFileEntry extends BaseFileEntry {
  data: Uint8Array;
}

export interface DirectoryEntry extends BaseFileEntry {
  type: 5; // DIRTYPE
}

export type FileEntry = StreamFileEntry | BufferFileEntry | DirectoryEntry;

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
    function (file, field) {
      return formatTarString(file.name, field[1]);
    },
    function (buffer, offset, field) {
      return parseTarString(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "mode",
    8,
    100,
    function (file, field) {
      let mode = file.mode || defaultFileMode;
      mode = mode & TPERMMASK;
      return formatTarNumber(mode, field[1], defaultFileMode);
    },
    function (buffer, offset, field) {
      let result = parseTarNumber(buffer.slice(offset, offset + field[1]));
      result &= TPERMMASK;
      return result;
    },
  ],
  [
    "uid",
    8,
    108,
    function (file, field) {
      return formatTarNumber(file.uid, field[1], defaultUid);
    },
    function (buffer, offset, field) {
      return parseTarNumber(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "gid",
    8,
    116,
    function (file, field) {
      return formatTarNumber(file.gid, field[1], defaultGid);
    },
    function (buffer, offset, field) {
      return parseTarNumber(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "size",
    12,
    124,
    function (file, field) {
      let size: number;
      if ("stream" in file) {
        size = file.size;
      } else if ("data" in file) {
        size = file.data.length;
      } else {
        size = 0;
      }
      return formatTarNumber(size, field[1]);
    },
    function (buffer, offset, field) {
      return parseTarNumber(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "modifyTime",
    12,
    136,
    function (file, field) {
      return formatTarNumber(file.modifyTime, field[1]);
    },
    function (buffer, offset, field) {
      return parseTarNumber(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "checksum",
    8,
    148,
    function (_file, _field) {
      return "        "; // placeholder
    },
    function (buffer, offset, field) {
      return parseTarNumber(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "type",
    1,
    156,
    function (file, _field) {
      // get last octal digit; 0 - regular file
      return "" + (toNumberWithDefault(file.type, 0) % 8);
    },
    function (buffer, offset, _field) {
      return (parseInt(String.fromCharCode(buffer[offset]), 10) || 0) % 8;
    },
  ],
  [
    "linkName",
    100,
    157,
    function (_file, _field) {
      return ""; // only regular files are supported
    },
    function (buffer, offset, field) {
      return parseTarString(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "ustar",
    8,
    257,
    function (_file, _field) {
      return TMAGIC; // magic + version
    },
    function (buffer, offset, field) {
      return fixUstarMagic(
        parseTarString(buffer.slice(offset, offset + field[1]), true)
      );
    },
  ],
  [
    "owner",
    32,
    265,
    function (file, field) {
      return formatTarString(file.owner, field[1]);
    },
    function (buffer, offset, field) {
      return parseTarString(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "group",
    32,
    297,
    function (file, field) {
      return formatTarString(file.group, field[1]);
    },
    function (buffer, offset, field) {
      return parseTarString(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "majorNumber",
    8,
    329,
    function (_file, _field) {
      return ""; // only regular files are supported
    },
    function (buffer, offset, field) {
      return parseTarNumber(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "minorNumber",
    8,
    337,
    function (_file, _field) {
      return ""; // only regular files are supported
    },
    function (buffer, offset, field) {
      return parseTarNumber(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "prefix",
    131,
    345,
    function (file, field) {
      return formatTarString(file.prefix, field[1]);
    },
    function (buffer, offset, field) {
      return parseTarString(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "accessTime",
    12,
    476,
    function (file, field) {
      return formatTarNumber(file.accessTime, field[1]);
    },
    function (buffer, offset, field) {
      return parseTarNumber(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "createTime",
    12,
    488,
    function (file, field) {
      return formatTarNumber(file.createTime, field[1]);
    },
    function (buffer, offset, field) {
      return parseTarNumber(buffer.slice(offset, offset + field[1]));
    },
  ],
];

export const effectiveHeaderSize = (function (header) {
  let last = header[header.length - 1];
  return last[2] + last[1]; // offset + size
})(posixHeader);

function fixUstarMagic(value: string) {
  if (value.length == 8) {
    let chars = value.split("");

    if (chars[5] == NULL_CHAR) {
      // TMAGIC ?
      if (chars[6] == " " || chars[6] == NULL_CHAR) {
        chars[6] = "0";
      }
      if (chars[7] == " " || chars[7] == NULL_CHAR) {
        chars[7] = "0";
      }
      let joinedChars = chars.join("");
      return joinedChars == TMAGIC ? joinedChars : value;
    } else if (chars[7] == NULL_CHAR) {
      // OLDGNU_MAGIC ?
      if (chars[5] == NULL_CHAR) {
        chars[5] = " ";
      }
      if (chars[6] == NULL_CHAR) {
        chars[6] = " ";
      }
      let joinedChars = chars.join("");
      return joinedChars == OLDGNU_MAGIC ? joinedChars : value;
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
  return value + NULL_CHAR;
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
  return valueAsString + NULL_CHAR;
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

export function parseTarString(
  bytes: Uint8Array,
  returnUnprocessed = false
): string {
  let result = utf8.decode(bytes);
  if (returnUnprocessed) {
    return result;
  }
  let index = result.indexOf(NULL_CHAR);
  return index >= 0 ? result.substr(0, index) : result;
}

export function parseTarNumber(bytes: Uint8Array) {
  let result = utf8.decode(bytes);
  return parseInt(result.replace(/^0+$/g, ""), 8) || 0;
}

export function calculateChecksum(buffer: Uint8Array) {
  let to = Math.min(effectiveHeaderSize, buffer.length);
  let result = 0;

  // When calculating checksum, `checksum` field should be
  // threat as filled with space char (byte 32)
  let skipFrom = 0;
  let skipTo = 0;
  posixHeader.every(function (field) {
    if (field[0] == "checksum") {
      skipFrom = field[2];
      skipTo = skipFrom + field[1];
      return false;
    }
    return true;
  });

  let whitespace = " ".charCodeAt(0);
  for (let i = 0; i < to; i++) {
    // 262144 = 8^6 - 6 octal digits - maximum possible value for checksum;
    // wrap to avoid numeric overflow
    let byte = i >= skipFrom && i < skipTo ? whitespace : buffer[i];
    result = (result + byte) % 262144;
  }
  return result;
}

export function paddingNeeded(size: number) {
  // align to record boundary
  return Math.ceil(size / recordSize) * recordSize - size;
}
