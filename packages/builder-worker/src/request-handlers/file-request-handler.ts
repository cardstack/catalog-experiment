import { Handler } from "./request-handler";
import { contentType, lookup } from "mime-types";
import { FileSystem, FileSystemError } from "../filesystem";
import {
  FileDescriptor,
  DirectoryDescriptor,
  Stat,
} from "../filesystem-drivers/filesystem-driver";
import { debug } from "../logger";
import { HttpStat } from "../filesystem-drivers/http-driver";
import { BuildManager } from "../build-manager";
import sortBy from "lodash/sortBy";

const builderOrigin = "https://service-worker";
const worker = (self as unknown) as ServiceWorkerGlobalScope;

export function handleFile(fs: FileSystem, buildManager: BuildManager) {
  return (async ({ request }) => {
    // turning this into a URL so we can normalize comparisons (trailing slashes
    // wont mess with us that way)
    let originURL = new URL(worker.origin);
    let requestURL = new URL(request.url);

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
      return await fetch(request);
    }

    // if the projects have not been built yet, then serve the UI
    if (
      !buildManager.rebuilder &&
      !requestURL.href.startsWith(`${originURL}catalogjs/ui/`)
    ) {
      requestURL = new URL(
        `.${requestURL.pathname}`,
        `${originURL}catalogjs/ui/`
      );
    }

    debug(`serving request ${requestURL} from filesystem`);
    let response = await serveFile(requestURL, fs);

    // we serve each project's input files as a fallback to their output
    // files, which lets you not worry about assets that are unchanged by the
    // build.
    if (response.status === 404 && buildManager.rebuilder) {
      // find the closest matching project output to our file URL, which will be the output
      // that has the longest URL (in this case one project has an output URL that
      // is the parent of another project)
      let matchingProjects = buildManager
        .projects()!
        .filter(([, output]) => requestURL.href.startsWith(output.href));
      if (matchingProjects.length > 0) {
        let [input] = sortBy(
          matchingProjects,
          ([, output]) => output.href.length
        ).pop()!;
        requestURL = new URL(`${requestURL.pathname.slice(1)}`, input);
        let fallbackResponse = await serveFile(requestURL, fs);
        if (fallbackResponse.status !== 404) {
          return fallbackResponse;
        }
      }
    }
    return response;
  }) as Handler;
}

async function serveFile(url: URL, fs: FileSystem): Promise<Response> {
  let file: FileDescriptor | DirectoryDescriptor | Response | undefined;
  let maybeDirectory = !url.href.split("/").pop()?.includes(".");
  try {
    file = await openFile(fs, url);
    if (file instanceof Response && !maybeDirectory) {
      return file;
    }
    if (file.type === "directory" || maybeDirectory) {
      if (!(file instanceof Response)) {
        await file.close();
      }
      if (!url.href.endsWith("/")) {
        url = new URL(url.href + "/");
      }
      url = new URL("index.html", url);
      file = (await openFile(fs, url)) as FileDescriptor;
    }
    if (file instanceof Response) {
      return file;
    }

    let response = new Response(await file.getReadableStream());
    await setContentHeaders(response, url.href, file);
    return response;
  } finally {
    if (file && !(file instanceof Response)) {
      await file.close();
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
