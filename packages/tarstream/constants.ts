export const NULL_CHAR = "\u0000";
export const TMAGIC = "ustar" + NULL_CHAR + "00"; // 'ustar', NULL, '00'
export const OLDGNU_MAGIC = "ustar  " + NULL_CHAR; // 'ustar  ', NULL

// Values used in typeflag field.
export const REGTYPE = 0; // regular file
export const LNKTYPE = 1; // link
export const SYMTYPE = 2; // reserved
export const CHRTYPE = 3; // character special
export const BLKTYPE = 4; // block special
export const DIRTYPE = 5; // directory
export const FIFOTYPE = 6; // FIFO special
export const CONTTYPE = 7; // reserved

// Bits used in the mode field, values in octal.
export const TSUID = parseInt("4000", 8); // set UID on execution
export const TSGID = parseInt("2000", 8); // set GID on execution
export const TSVTX = parseInt("1000", 8); // reserved

// file permissions
export const TUREAD = parseInt("0400", 8); // read by owner
export const TUWRITE = parseInt("0200", 8); // write by owner
export const TUEXEC = parseInt("0100", 8); // execute/search by owner
export const TGREAD = parseInt("0040", 8); // read by group
export const TGWRITE = parseInt("0020", 8); // write by group
export const TGEXEC = parseInt("0010", 8); // execute/search by group
export const TOREAD = parseInt("0004", 8); // read by other
export const TOWRITE = parseInt("0002", 8); // write by other
export const TOEXEC = parseInt("0001", 8); // execute/search by other

export const TPERMALL = parseInt("0777", 8); // rwxrwxrwx
export const TPERMMASK = parseInt("0777", 8); // permissions bitmask
