import { Tar } from "tarstream";

export async function tarTest() {
  let t = new Tar();

  t.addFile({
    name: "tartest/hello.txt",
    data: new TextEncoder().encode("This is a text file."),
  });

  let photo = await fetch("http://localhost:4200/bike.jpg");
  let length = photo.headers.get("content-length");
  if (length == null) {
    throw new Error(`we need a content length to make this work`);
  }
  t.addFile({
    name: "tartest/bike.jpg",
    stream: () => photo.body!,
    size: parseInt(length, 10),
  });

  let html = await fetch("http://localhost:4200/index.html");
  length = html.headers.get("content-length");
  if (length == null) {
    throw new Error(`we need a content length to make this work`);
  }
  t.addFile({
    name: "tartest/index.html",
    stream: () => html.body!,
    size: parseInt(length, 10),
  });

  return new Response(t.finish(), {
    headers: {
      "content-disposition": "attachment; filename*=UTF-8''test.tar",
      "content-type": "application/octet-stream; charset=utf-8",
    },
  });
}
