import { Handler, Context } from "./request-handler";
import { contentType, lookup } from "mime-types";
import { FileSystem, FileSystemError, FileDescriptor } from "./filesystem";
import { join } from "./path";

export const handleFileRequest: Handler = async function (
  req: Request,
  context: Context
) {
  let requestURL = new URL(req.url);
  if (
    !context.originURL.href ||
    requestURL.origin !== context.originURL.origin
  ) {
    return new Response((await fetch(req)).body);
  }

  console.log(`serving request ${requestURL} from filesystem`);
  let path = requestURL.pathname;
  let file = await openFile(
    context.fs,
    url(requestURL.origin, context.webroot, path)
  );
  if (file instanceof Response) {
    return file;
  }
  if (file.stat().type === "directory") {
    path = join(path, "index.html");
    file = await openFile(
      context.fs,
      url(requestURL.origin, context.webroot, path)
    );
    if (file instanceof Response) {
      return file;
    }
  }
  let response = new Response(file.getReadbleStream());
  setContentHeaders(response, path, file);
  return response;
};

function url(origin: string, webroot: string, relativePath: string) {
  return new URL(join(webroot, relativePath), origin);
}

async function openFile(
  fs: FileSystem,
  url: URL
): Promise<FileDescriptor | Response> {
  try {
    return await fs.open(url);
  } catch (err) {
    if (err instanceof FileSystemError && err.code === "NOT_FOUND") {
      return new Response("Not found", { status: 404 });
    }
    throw err;
  }
}

function setContentHeaders(
  response: Response,
  path: string,
  file: FileDescriptor
): void {
  let mime = lookup(path) || "application/octet-stream";
  response.headers.set(
    "content-type",
    contentType(mime) as Exclude<string, false>
  );
  response.headers.set("content-length", String(file.stat().size));
}
