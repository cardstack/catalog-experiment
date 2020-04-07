import { serve } from "https://deno.land/std/http/server.ts";
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  WebSocket,
} from "https://deno.land/std/ws/mod.ts";
import Watcher from "http://localhost:8081/watcher.ts";

export default class FileWatcherServer {
  watcher: Watcher;
  constructor(private port: string | number, directory: string) {
    this.watcher = new Watcher(directory);
  }
  async start() {
    console.log(`websocket server is running on: ${this.port}`);

    for await (const req of serve(`:${this.port}`)) {
      const { headers, conn } = req;
      acceptWebSocket({
        conn,
        headers,
        bufReader: req.r,
        bufWriter: req.w,
      })
        .then(
          async (sock: WebSocket): Promise<void> => {
            console.log("socket connected!");
            await this.watcher.add(sock);
            const it = sock.receive();
            while (true) {
              try {
                const { done, value } = await it.next();
                if (done) {
                  break;
                }
                const ev = value;
                if (isWebSocketCloseEvent(ev)) {
                  const { code, reason } = ev;
                  this.watcher.remove(sock);
                  console.log("ws:Close", code, reason);
                }
              } catch (e) {
                console.error(`failed to receive frame: ${e}`);
                this.watcher.remove(sock);
                await sock.close(1000).catch(console.error);
              }
            }
          }
        )
        .catch((err: Error): void => {
          console.error(`failed to accept websocket: ${err}`);
        });
    }
  }
}
