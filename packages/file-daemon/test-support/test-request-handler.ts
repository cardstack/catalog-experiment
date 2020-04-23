import http from "http";
import { join, resolve } from "path";
import { parse as urlParse } from "url";
import { parse as qsParse } from "qs";
import { ensureFileSync, outputFileSync, removeSync } from "fs-extra";
import { createWriteStream, mkdirSync } from "fs";

export type HandlerMaker = (
  directory: string,
  key: string
) => (request: http.IncomingMessage, response: http.ServerResponse) => boolean;

export const makeTestHandler: HandlerMaker = function (
  directory: string,
  key: string
) {
  return (req: http.IncomingMessage, res: http.ServerResponse) => {
    let path = req.url!;
    let filePath = resolve(join(directory, urlParse(path).pathname || ""));
    let query = qsParse(urlParse(path).query || "");
    if (req.method === "POST" && query.key === key) {
      if (query.scenario) {
        removeSync(directory);
        mkdirSync(directory);
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          let scenario = JSON.parse(body);
          for (let [path, contents] of Object.entries(scenario)) {
            outputFileSync(join(directory, path), contents);
          }
          res.statusCode = 200;
          res.end("ok");
        });
        return true;
      } else if (query.reset) {
        removeSync(directory);
        mkdirSync(directory);
        res.statusCode = 200;
        res.end();
        return true;
      } else {
        ensureFileSync(filePath);
        req.pipe(createWriteStream(filePath));
        res.statusCode = 200;
        res.end();
        return true;
      }
    } else if (req.method === "DELETE" && query.key === key) {
      removeSync(filePath);
      res.statusCode = 204;
      res.end();
      return true;
    }
    return false;
  };
};
