import { Handler } from "./request-handler";
import { contentType, lookup } from "mime-types";
import { FileSystem, FileSystemError } from "./filesystem";
import { FileDescriptor } from "./filesystem-driver";
import { join } from "./path";

const builderOrigin = "http://localhost:8080";
const worker = (self as unknown) as ServiceWorkerGlobalScope;

export const handleFileRequest: Handler = async function (req, context) {
  // turning this into a URL so we can normalize comparisons (trailing slashes
  // wont mess with us that way)
  let originURL = new URL(worker.origin);
  let requestURL = new URL(req.url);
  let isCatalogJSUIRequest = /^\/catalogjs-ui/.test(requestURL.pathname);

  // For the webpack hosted builder requests, we need to honor same origin
  // policy (apparently), as the responses are empty otherwise. So instead route
  // these requests through the file daemon where they will be proxied to the
  // webpack hosted builder. I wonder about 3rd party js, we might need the file
  // daemon to be more aggressive with its proxying....
  if (
    requestURL.origin === builderOrigin ||
    isCatalogJSUIRequest ||
    requestURL.pathname === "/ember-cli-live-reload.js"
  ) {
    return new Response(
      (
        await fetch(
          new URL(
            requestURL.pathname,
            isCatalogJSUIRequest ? requestURL.origin : originURL.href
          ).href
        )
      ).body
    );
  }

  // This might not be doing what we think it's doing per the comment above...
  if (!originURL.href || requestURL.origin !== originURL.origin) {
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
  if ((await file.stat()).type === "directory") {
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
  await setContentHeaders(response, path, file);
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
    return (await fs.open(url)) as FileDescriptor;
  } catch (err) {
    if (err instanceof FileSystemError && err.code === "NOT_FOUND") {
      return new Response("Not found", { status: 404 });
    }
    throw err;
  }
}

async function setContentHeaders(
  response: Response,
  path: string,
  file: FileDescriptor
): Promise<void> {
  let mime = lookup(path) || "application/octet-stream";
  response.headers.set(
    "content-type",
    contentType(mime) as Exclude<string, false>
  );
  response.headers.set("content-length", String((await file.stat()).size));
}
