export interface Directory {}

export class FileSystem {
  async writeFile(fileName: string, buffer: Uint8Array): Promise<void>;
  async writeFile(fileName: string, stream: ReadableStream): Promise<void>;
  async writeFile(
    fileName: string,
    streamOrBuffer: ReadableStream | Uint8Array
  ): Promise<void> {}

  async stat(filename: string): { etag: string } {}

  async tempdir(): Promise<Directory> {}

  // Accessors:
  // read file as buffer, maybe a stream too (to send into indexDB)
  // directory listing
}
