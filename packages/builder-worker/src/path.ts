export const ROOT = Object.freeze(new URL("http://root"));

export function baseName(url: URL): string {
  let segments = splitURL(url);
  let last = segments.pop()!;
  if (last === "") {
    return "/";
  }
  return last;
}

export function dirName(url: URL): string | undefined {
  if (url.href === ROOT.href) {
    return;
  }

  let segments = splitURL(url);
  if (segments.length === 1) {
    return ROOT.href;
  }

  segments.pop();
  return segments.join("/");
}

export function splitURL(url: URL): string[] {
  if ((url.pathname === "/") !== !url.pathname) {
    return [url.origin];
  } else {
    // FYI trailing slashes will appear as empty strings in the array, unsure if that's ultimately what we want...
    return [url.origin, ...url.pathname.slice(1).split("/")];
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

export function assertURLEndsInDir(url: URL) {
  if (url.href.slice(-1) === "/") {
    return url;
  }
  if (url.href.slice(-1) !== "/") {
    return new URL(`${url.href}/`);
  }
  return;
}
