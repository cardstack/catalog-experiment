import { Next, ParameterizedContext } from "koa";

type Context = ParameterizedContext<{ exception?: Error }>;

export async function serverLog(ctxt: Context, next: Next) {
  await next();
  const d = new Date().toISOString();
  const dateFmt = `[${d.slice(0, 10)} ${d.slice(11, 19)}]`;
  console.log(
    `${dateFmt} "${ctxt.req.method} ${ctxt.req.url}" ${ctxt.res.statusCode}`
  );
  if (ctxt.res.statusCode === 500 && ctxt.state.exception) {
    console.error(ctxt.state.exception);
  }
}

export async function cors(ctxt: Context, next: Next) {
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

export async function errorHandler(ctxt: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    ctxt.state.exception = err;
    if (err.code === "ENOENT") {
      ctxt.response.body = "Not Found";
      ctxt.response.status = 404;
    } else {
      ctxt.response.body = "Server error";
      ctxt.response.status = 500;
    }
  }
}
