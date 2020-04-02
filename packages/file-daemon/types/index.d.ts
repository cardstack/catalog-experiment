declare module "https://deno.land/std/ws/mod.ts" {
  export * from "std/ws/mod";
}

declare module "https://deno.land/std/path/mod.ts" {
  export * from "std/path/mod";
}

declare module "https://deno.land/std/media_types/mod.ts" {
  export * from "std/media_types/mod";
}

declare module "https://deno.land/std/testing/asserts.ts" {
  export * from "std/testing/asserts";
}

declare module "https://deno.land/std/flags/mod.ts" {
  export * from "std/flags/mod";
}

declare module "https://deno.land/std/http/mod.ts" {
  export * from "std/http/mod";
}

declare module "https://deno.land/std/fs/mod.ts" {
  export * from "std/fs/mod";
}

declare module "https://deno.land/std/http/server.ts" {
  export * from "std/http/server";
}

declare module "http://localhost:8081/interfaces.ts" {
  export * from "file-daemon/interfaces";
}

declare module "http://localhost:8081/watcher.ts" {
  export { default } from "file-daemon/watcher";
}

declare module "http://localhost:8081/file-hosting-server.ts" {
  export { default } from "file-daemon/file-hosting-server";
}

declare module "http://localhost:8081/file-watcher-server.ts" {
  export { default } from "file-daemon/file-watcher-server";
}
