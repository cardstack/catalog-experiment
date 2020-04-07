// TODO remove the tarstream package--it's too painful outside of deno

// @deno-types="./vendor/web-streams/index.d.ts"
import {
  ReadableStream,
  UnderlyingSource,
  ReadableStreamDefaultController,
  ReadableStreamDefaultReader,
} from "http://localhost:8081/vendor/web-streams/index.js";

type State =
  | { name: "readyForNextFile" }
  | { name: "sentHeader"; currentFile: FileEntry }
  | { name: "sentUnpaddedFile"; paddingNeeded: number }
  | {
      name: "streamingFile";
      reader: ReadableStreamDefaultReader<Uint8Array>;
      currentFile: StreamFileEntry;
      bytesSent: number;
    };

export class Tar {
  private queue: FileEntry[] = [];
  private finished = false;

  constructor() {}

  addFile(file: FileEntry): void {
    if (this.finished) {
      throw new Error(`can't addFile after calling finish`);
    }
    this.queue.push(file);
  }

  finish(): ReadableStream<Uint8Array> {
    if (this.finished) {
      throw new Error(`tried to call finish more than once`);
    }
    this.finished = true;
    return new ReadableStream(this.source);
  }

  private get source(): UnderlyingSource<Uint8Array> {
    return new TarSource(this.queue);
  }
}

class TarSource implements UnderlyingSource<Uint8Array> {
  private state: State = { name: "readyForNextFile" };
  constructor(private queue: FileEntry[]) {}
  start(_controller: ReadableStreamDefaultController<Uint8Array>) {
    // we don't need to do anything here, the docs don't make it clear if this
    // method is optional though
  }
  async pull(
    controller: ReadableStreamDefaultController<Uint8Array>
  ): Promise<void> {
    switch (this.state.name) {
      case "readyForNextFile":
        let file = this.queue.shift();
        if (!file) {
          // at the end we have to emit two empty records
          controller.enqueue(new Uint8Array(recordSize * 2));
          controller.close();
          return;
        }
        let buffer = new Uint8Array(recordSize);
        writeHeader(buffer, file);
        this.state = { name: "sentHeader", currentFile: file };
        controller.enqueue(buffer);
        return;
      case "sentHeader":
        if ("data" in this.state.currentFile) {
          // it's a buffer, so we can finish it right now
          let buffer = this.state.currentFile.data;
          this.state = {
            name: "sentUnpaddedFile",
            paddingNeeded: paddingNeeded(buffer.length),
          };
          controller.enqueue(buffer);
          return;
        }
        // start streaming the file
        this.state = {
          name: "streamingFile",
          reader: this.state.currentFile.stream.getReader(),
          currentFile: this.state.currentFile,
          bytesSent: 0,
        };
        return this.pull(controller);
      case "streamingFile":
        let chunk = await this.state.reader.read();
        if (chunk.done) {
          if (this.state.bytesSent !== this.state.currentFile.size) {
            throw new Error(
              `file size mismatch: you said ${this.state.currentFile} is ` +
                `${this.state.currentFile.size} bytes, but streamed ${this.state.bytesSent} bytes`
            );
          }
          this.state = {
            name: "sentUnpaddedFile",
            paddingNeeded: paddingNeeded(this.state.bytesSent),
          };
          return this.pull(controller);
        }
        this.state = {
          name: "streamingFile",
          reader: this.state.reader,
          currentFile: this.state.currentFile,
          bytesSent: this.state.bytesSent + chunk.value.length,
        };
        controller.enqueue(chunk.value);
        return;
      case "sentUnpaddedFile":
        if (this.state.paddingNeeded === 0) {
          this.state = { name: "readyForNextFile" };
          return this.pull(controller);
        }
        let padding = new Uint8Array(this.state.paddingNeeded);
        this.state = { name: "readyForNextFile" };
        controller.enqueue(padding);
        return;
      default:
        throw assertNever(this.state);
    }
  }
}

function writeHeader(buffer: Uint8Array, file: FileEntry) {
  let currentOffset = 0;
  posixHeader.forEach(function (field) {
    let value = field[3](file, field);
    let length = value.length;
    for (let i = 0; i < length; i += 1) {
      buffer[currentOffset + i] = value.charCodeAt(i) & 0xff;
    }
    currentOffset += field[1]; // move to the next field
  });

  let field = posixHeader.find(function (field) {
    return field[0] == "checksum";
  });

  if (field) {
    // Patch checksum field
    let checksum = calculateChecksum(buffer, 0, true);
    let value = formatTarNumber(checksum, field[1] - 2) + NULL_CHAR + " ";
    currentOffset = field[2];
    for (let i = 0; i < value.length; i += 1) {
      // put bytes
      buffer[currentOffset] = value.charCodeAt(i) & 0xff;
      currentOffset++;
    }
  }
}

function paddingNeeded(size: number) {
  // align to record boundary
  return Math.ceil(size / recordSize) * recordSize - size;
}

function assertNever(_value: never): never {
  throw new Error(`not never`);
}

// Generally we'd want all the stuff below to be in their own modules, but to
// make things easier in terms of working nicely in deno (since it has some
// unorthodox ideas around how to specify imported files) we are just inlining
// all the things we'd normally put into other modules.

const NULL_CHAR = "\u0000";
const TMAGIC = "ustar" + NULL_CHAR + "00"; // 'ustar', NULL, '00'
const OLDGNU_MAGIC = "ustar  " + NULL_CHAR; // 'ustar  ', NULL

/*
// Values used in typeflag field.
const REGTYPE = 0; // regular file
const LNKTYPE = 1; // link
const SYMTYPE = 2; // reserved
const CHRTYPE = 3; // character special
const BLKTYPE = 4; // block special
const DIRTYPE = 5; // directory
const FIFOTYPE = 6; // FIFO special
const CONTTYPE = 7; // reserved

// Bits used in the mode field, values in octal.
const TSUID = parseInt("4000", 8); // set UID on execution
const TSGID = parseInt("2000", 8); // set GID on execution
const TSVTX = parseInt("1000", 8); // reserved

// file permissions
const TUREAD = parseInt("0400", 8); // read by owner
const TUWRITE = parseInt("0200", 8); // write by owner
const TUEXEC = parseInt("0100", 8); // execute/search by owner
const TGREAD = parseInt("0040", 8); // read by group
const TGWRITE = parseInt("0020", 8); // write by group
const TGEXEC = parseInt("0010", 8); // execute/search by group
const TOREAD = parseInt("0004", 8); // read by other
const TOWRITE = parseInt("0002", 8); // write by other
const TOEXEC = parseInt("0001", 8); // execute/search by other
*/

const TPERMALL = parseInt("0777", 8); // rwxrwxrwx
const TPERMMASK = parseInt("0777", 8); // permissions bitmask

const utf8 = new TextDecoder("utf-8");
const recordSize = 512;
const defaultFileMode = TPERMALL; // rwxrwxrwx
const defaultUid = 0; // root
const defaultGid = 0; // root

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

interface StreamFileEntry extends BaseFileEntry {
  stream: ReadableStream<Uint8Array>;
  size: number;
}

interface BufferFileEntry extends BaseFileEntry {
  data: Uint8Array;
}

type FileEntry = StreamFileEntry | BufferFileEntry;

type PosixHeader = [
  string,
  number,
  number,
  (file: FileEntry, field: PosixHeader) => string,
  (buffer: Uint8Array, offset: number, field: PosixHeader) => unknown
];

const posixHeader: PosixHeader[] = [
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
      } else {
        size = file.data.length;
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
      return formatTarDateTime(file.modifyTime, field[1]);
    },
    function (buffer, offset, field) {
      return parseTarDateTime(buffer.slice(offset, offset + field[1]));
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
    // function(file, field) {
    //   return (
    //     file.ustar == TMAGIC || file.ustar == OLDGNU_MAGIC
    //   );
    // },
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
      return formatTarDateTime(file.accessTime, field[1]);
    },
    function (buffer, offset, field) {
      return parseTarDateTime(buffer.slice(offset, offset + field[1]));
    },
  ],
  [
    "createTime",
    12,
    488,
    function (file, field) {
      return formatTarDateTime(file.createTime, field[1]);
    },
    function (buffer, offset, field) {
      return parseTarDateTime(buffer.slice(offset, offset + field[1]));
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
  let index = result.indexOf(NULL_CHAR);
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
    posixHeader.every(function (field) {
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
