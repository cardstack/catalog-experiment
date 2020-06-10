import Service from "@ember/service";
// @ts-ignore
import { task } from "ember-concurrency";

export default class EventRegistrarService extends Service {
  register = task(function* () {
    yield fetch(`/register-client`);
  });
}
