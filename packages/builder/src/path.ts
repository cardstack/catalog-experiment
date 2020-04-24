export function urlToPath(url: URL): string {
  return join(url.origin.replace(/\//g, "|"), url.pathname);
}

export function pathToURL(path: string): URL {
  if (path.slice(0, 1) === "/") {
    path = path.slice(1);
  }
  let [origin, ...pathParts] = splitPath(path);
  if (pathParts.length === 0) {
    pathParts = ["/"];
  }
  return new URL(join(...pathParts), origin.replace(/\|/g, "/"));
}

export function baseName(path: string): string {
  return splitPath(path).pop()!;
}

export function dirName(path: string): string | undefined {
  // the root dir '/' has no parent dir
  if (path === "/" || !path.includes("/")) return;

  let dirName = path.slice(0, -1 * baseName(path).length - 1);
  if (path.charAt(0) === "/") {
    return dirName || "/";
  }
  return dirName;
}

export function splitPath(path: string): string[] {
  if (path === "/") {
    return ["/"];
  }
  let segments = path.split("/");
  if (segments[0] === "") {
    segments[0] = "/";
  }
  return segments;
}

export function join(...pathParts: string[]): string {
  pathParts = pathParts.filter(Boolean);
  if (pathParts.length === 0) {
    throw new Error("Missing path parts");
  }
  if (pathParts.length === 1 && pathParts[0] === "/") {
    return "/";
  }

  for (let part of pathParts) {
    if (part.slice(0, 1) === "/") {
      part = part.slice(1);
    }
  }
  pathParts = pathParts.map((part) =>
    part.slice(0, 1) === "/" ? part.slice(1) : part
  );

  return `/${pathParts.filter(Boolean).join("/")}`;
}

export function isURL(possibleURL: string): boolean {
  try {
    new URL(possibleURL);
    return true;
  } catch (e) {
    if (e.message.includes("Invalid URL")) {
      return false;
    }
    throw e;
  }
}

export function maybeURL(
  possibleURL: string,
  relativeTo?: string | URL | undefined
): URL | undefined {
  try {
    return new URL(possibleURL, relativeTo);
  } catch (e) {
    if (e.message.includes("Invalid URL")) {
      return undefined;
    }
    throw e;
  }
}

export function relativeURL(url: URL, relativeTo: URL): string | undefined {
  debugger;
  if (url.origin !== relativeTo.origin) {
    return undefined;
  }
  let ourParts = url.pathname.split("/");
  let theirParts = relativeTo.pathname.split("/");

  // element zero for both is "/" because they always start with a slash check
  // element 1, if those differ, our nears common ancestor is the root of the
  // origin.
  if (ourParts[1] !== theirParts[1]) {
    return url.pathname;
  }

  while (
    ourParts[0] === theirParts[0] &&
    ourParts.length > 0 &&
    theirParts.length > 0
  ) {
    ourParts.shift();
    theirParts.shift();
  }
  if (theirParts.length > 1) {
    theirParts.shift();
    return [...theirParts.map(() => ".."), ...ourParts].join("/");
  } else {
    return [".", ...ourParts].join("/");
  }
}

export function maybeRelativeURL(url: URL, relativeTo: URL): string {
  let rel = relativeURL(url, relativeTo);
  if (rel) {
    return rel;
  } else {
    return url.href;
  }
}
