export const ROOT = Object.freeze(new URL("https://root"));

export function baseName(url: URL): string {
  let segments = splitURL(url);
  return segments.pop()!;
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
  return [...segments].join("");
}

export function splitURL(url: URL): string[] {
  if ((url.pathname === "/") !== !url.pathname) {
    return [`${url.origin}/`];
  } else {
    // make sure we faithfully represent directories with a trailing slash
    let segments = url.pathname.slice(1).split("/");
    if (segments[segments.length - 1] === "") {
      segments.pop();
      segments[segments.length - 1] = `${segments.slice(-1)}/`;
    }
    return [url.origin, ...segments].map((segment, i) =>
      i < segments.length ? `${segment}/` : segment
    );
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
  } else {
    return new URL(`${url.href}/`);
  }
}
