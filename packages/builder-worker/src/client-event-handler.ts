import { Event } from "./event-bus";
import { get, update } from "idb-keyval";

const worker = (self as unknown) as ServiceWorkerGlobalScope;
const DOM_CLIENTS = "dom-clients";

// TODO merge this logic into the event bus
export class ClientEventHandler {
  async addClient(clientId: string) {
    await update(DOM_CLIENTS, (clients: string[] | undefined) =>
      !clients ? [clientId] : [clientId, ...clients]
    );
  }

  async removeClient(clientId: string) {
    await update(DOM_CLIENTS, (clients: string[] | undefined) =>
      !clients ? [] : clients.filter((c) => c !== clientId)
    );
  }

  async sendEvent(clientId: string, event: Event) {
    let client = await worker.clients.get(clientId);
    if (!client) {
      return;
    }
    client.postMessage(event);
  }

  handleEvent(event: Event) {
    let self = this;
    (async () => {
      for (let clientId of (await get(DOM_CLIENTS)) ?? []) {
        await self.sendEvent(clientId, event);
      }
    })();
  }
}
