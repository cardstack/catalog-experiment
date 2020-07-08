import Koa from "koa";

export async function cors(ctxt: Koa.Context, next: Koa.Next) {
  ctxt.response.set("Access-Control-Allow-Origin", "*");
  if (ctxt.request.method === "OPTIONS") {
    ctxt.response.set(
      "Access-Control-Allow-Methods",
      "GET,POST,PATCH,DELETE,OPTIONS"
    );
    ctxt.response.set(
      "Access-Control-Allow-Headers",
      "Authorization, Content-Type, If-Match, X-Requested-With"
    );
    ctxt.status = 200;
    return;
  }
  await next();
}
