import Koa from "koa";

export async function serverLog(ctxt: Koa.Context, next: Koa.Next) {
  await next();
  const d = new Date().toISOString();
  const dateFmt = `[${d.slice(0, 10)} ${d.slice(11, 19)}]`;
  console.log(
    `${dateFmt} "${ctxt.req.method} ${ctxt.req.url}" ${ctxt.res.statusCode}`
  );
}
