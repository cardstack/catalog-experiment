import { FileDaemonClient } from "../../src/file-daemon-client";
import { FileSystem } from "../../src/filesystem";
import { testFileDaemonURL, testWebsocketURL } from "../origins";
//@ts-ignore: webpack will set this macro
let fileDaemonKey = FILE_DAEMON_KEY;

export function makeClient(fs: FileSystem, mountpoint = "/") {
  return new FileDaemonClient(
    testFileDaemonURL,
    testWebsocketURL,
    fs,
    mountpoint
  );
}

export async function setFile(path: string, contents: string) {
  let url = new URL(path, testFileDaemonURL);
  await fetch(`${url}?key=${encodeURIComponent(fileDaemonKey)}`, {
    method: "POST",
    body: contents,
  });
}

export async function removeFile(path: string) {
  let url = new URL(path, testFileDaemonURL);
  await fetch(`${url}?key=${encodeURIComponent(fileDaemonKey)}`, {
    method: "DELETE",
  });
}

export async function setupScenario(scenario: { [filePath: string]: string }) {
  await fetch(
    `${testFileDaemonURL}?scenario=true&key=${encodeURIComponent(
      fileDaemonKey
    )}`,
    {
      method: "POST",
      body: JSON.stringify(scenario),
    }
  );
}

export async function resetFileSystem() {
  await fetch(
    `${testFileDaemonURL}?reset=true&key=${encodeURIComponent(fileDaemonKey)}`,
    {
      method: "POST",
    }
  );
}
