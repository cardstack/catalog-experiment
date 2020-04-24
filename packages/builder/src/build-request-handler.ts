import { parse } from "@babel/core";
import { Handler, Context } from "./request-handler";
import { contentType, lookup } from "mime-types";
import { FileSystem, FileSystemError, FileDescriptor } from "./filesystem";
import { join } from "./path";

export const handleBuildRequest: Handler = async function (
  req: Request,
  context: Context
) {
  let requestURL = new URL(req.url);
  if (requestURL.origin !== context.origin) {
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
  if (path.split(".").pop() === "js") {
    return bundled(path, file);
  } else {
    let response = new Response(file.getReadbleStream());
    setContentHeaders(response, path, file);
    return response;
  }
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

async function bundled(path: string, file: FileDescriptor): Promise<Response> {
  let js = await file.readText();
  if (!js) {
    return new Response(`'${path}' is an empty file`, { status: 500 });
  }

  // just to prove that we can do this, but really this goes into the builder...
  let result = await parse(js, {});
  console.log(result);

  let response = new Response(js);
  response.headers.set("content-type", "application/javascript");
  response.headers.set("content-length", String(js.length));

  return response;
}
