#!/usr/bin/env -S deno --allow-net

// TODO move this implementation to packages/builder, and dont use deno...

import {
  connectWebSocket,
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
  isWebSocketPongEvent
} from "https://deno.land/std/ws/mod.ts";
import { encode } from "https://deno.land/std/strings/mod.ts";
import { BufReader } from "https://deno.land/std/io/bufio.ts";
import { TextProtoReader } from "https://deno.land/std/textproto/mod.ts";
import { blue, green, red, yellow } from "https://deno.land/std/fmt/colors.ts";

const endpoint = Deno.args[0] || "ws://127.0.0.1:3000";
/** simple websocket cli */
const sock = await connectWebSocket(endpoint);
console.log(green(`ws connected! type "close" to quit`));
(async function (): Promise<void> {
  for await (const msg of sock.receive()) {
    if (typeof msg === "string") {
      console.log(yellow("< " + msg));
    } else if (isWebSocketPingEvent(msg)) {
      console.log(blue("< ping"));
    } else if (isWebSocketPongEvent(msg)) {
      console.log(blue("< pong"));
    } else if (isWebSocketCloseEvent(msg)) {
      console.log(red(`closed: code=${msg.code}, reason=${msg.reason}`));
    }
  }
})();

const tpr = new TextProtoReader(new BufReader(Deno.stdin));
while (true) {
  await Deno.stdout.write(encode("> "));
  const line = await tpr.readLine();
  if (line === Deno.EOF) {
    break;
  }
  if (line === "close") {
    break;
  } else if (line === "ping") {
    await sock.ping();
  } else {
    await sock.send(line);
  }
  // FIXME: Without this,
  // sock.receive() won't resolved though it is readable...
  await new Promise((resolve): void => {
    setTimeout(resolve, 0);
  });
}
await sock.close(1000);
// FIXME: conn.close() won't shutdown process...
Deno.exit(0);