import { Handler, Context } from "./request-handler";
import { contentType, lookup } from "mime-types";
import { FileSystem, FileSystemError, FileDescriptor } from "./filesystem";
import { join } from "./path";

const builderOrigin = "http://localhost:8080";

export const handleFileRequest: Handler = async function (
  req: Request,
  context: Context
) {
  let requestURL = new URL(req.url);
  // For the webpack hosted builder requests, we need to honor same origin
  // policy (apparently), as the responses are empty otherwise. So instead route
  // these requests through the file daemon where they will be proxied to the
  // webpack hosted builder. I wonder about 3rd party js, we might need the file
  // daemon to be more aggressive with its proxying....
  if (context.originURL && requestURL.origin === builderOrigin) {
    return new Response(
      (
        await fetch(new URL(requestURL.pathname, context.originURL.href).href)
      ).body
    );
  }

  // This might not be doing what we think it's doing per the comment above...
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
