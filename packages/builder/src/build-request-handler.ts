import { parse } from "@babel/core";
import { Handler, Context } from "./request-handler";
import { contentType, lookup } from "mime-types";
import { FileSystem, FileSystemError, FileDescriptor } from "./filesystem";
import { join } from "./path";

const worker = (self as unknown) as ServiceWorkerGlobalScope;
export const handleBuildRequest: Handler = async function (
  req: Request,
  context: Context
) {
  let requestURL = new URL(req.url);
  let path = requestURL.pathname;
  let url = new URL(join(context.webroot, path), worker.origin);
  let file = await openFile(context.fs, url);
  if (file instanceof Response) {
    return file;
  }
  if (file.stat.type === "directory") {
    path = join(path, "index.html");
    file = await openFile(context.fs, url);
    if (file instanceof Response) {
      return file;
    }
  }
  if (path.split(".").pop() === "js") {
    return bundled(path, file);
  } else {
    let response = new Response(file.getReadbleStream());
    setContentHeaders(response, path, file);
    return response;
  }
};

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
  response.headers.set("content-length", String(file.stat.size));
}

async function bundled(path: string, file: FileDescriptor): Promise<Response> {
  let js = await file.readText();
  if (!js) {
    return new Response(`'${path}' is an empty file`, { status: 500 });
  }
  let result = await parse(js, {});
  console.log(result);

  let response = new Response(js);
  response.headers.set("content-type", "application/javascript");
  response.headers.set("content-length", String(js.length));

  return response;
}
