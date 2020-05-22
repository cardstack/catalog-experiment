import { Handler, Context } from "./request-handler";
import { contentType, lookup } from "mime-types";
import { FileSystem, FileSystemError } from "../filesystem";
import {
  FileDescriptor,
  DirectoryDescriptor,
  Stat,
} from "../filesystem-drivers/filesystem-driver";
import { Logger } from "../logger";
import { HttpStat } from "../filesystem-drivers/http-driver";
import { relativeURL } from "../path";

const builderOrigin = "http://localhost:8080";
const worker = (self as unknown) as ServiceWorkerGlobalScope;
const { log } = Logger;

export const handleFileRequest: Handler = async function (req, context) {
  // turning this into a URL so we can normalize comparisons (trailing slashes
  // wont mess with us that way)
  let originURL = new URL(worker.origin);
  let requestURL = new URL(req.url);

  // For the webpack hosted builder requests, we need to honor same origin
  // policy (apparently), as the responses are empty otherwise. So instead route
  // these requests through the file daemon where they will be proxied to the
  // webpack hosted builder.
  if (requestURL.origin === builderOrigin) {
    return new Response(
      (await fetch(new URL(requestURL.pathname, originURL).href)).body
    );
  }

  if (!originURL.href || requestURL.origin !== originURL.origin) {
    return await fetch(req);
  }

  log(`serving request ${requestURL} from filesystem`);
  let response = await serveFile(requestURL, context);
  if (response.status === 404) {
    for (let [input, output] of context.buildManager.projects) {
      // we serve each project's input files as a fallback to their output
      // files, which lets you not worry about assets that are unchanged by the
      // build.
      if (requestURL.href.startsWith(output.href)) {
        let fallbackResponse = await serveFile(
          new URL(relativeURL(requestURL, output)!, input),
          context
        );
        if (fallbackResponse.status !== 404) {
          return fallbackResponse;
        }
      }
    }
  }
  return response;
};

async function serveFile(url: URL, context: Context): Promise<Response> {
  let file: FileDescriptor | DirectoryDescriptor | Response | undefined;
  try {
    file = await openFile(context.fs, url);
    if (file instanceof Response) {
      return file;
    }
    if (file.type === "directory") {
      file.close();
      if (!url.href.endsWith("/")) {
        url = new URL(url.href + "/");
      }
      url = new URL("index.html", url);
      file = (await openFile(context.fs, url)) as FileDescriptor;
      if (file instanceof Response) {
        return file;
      }
    }
    let response = new Response(await file.getReadbleStream());
    await setContentHeaders(response, url.href, file);
    return response;
  } finally {
    if (file && !(file instanceof Response)) {
      file.close();
    }
  }
}

async function openFile(
  fs: FileSystem,
  url: URL
): Promise<FileDescriptor | DirectoryDescriptor | Response> {
  try {
    return await fs.open(url);
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
  let mime: string;
  let upstreamContentType: string | undefined;
  let stat = (await file.stat()) as Stat | HttpStat;
  if ("contentType" in stat) {
    upstreamContentType = stat.contentType;
  } else {
    mime = lookup(path) || "application/octet-stream";
  }
  response.headers.set(
    "content-type",
    upstreamContentType || (contentType(mime!) as Exclude<string, false>)
  );
  response.headers.set("content-length", String(stat.size));
}
