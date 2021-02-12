import { helloWorld, cutestPuppies } from "./ui";
import { introspectESModule } from "./babel-eval";

export async function boot(rootElement) {
  rootElement.append(helloWorld());
  rootElement.append(cutestPuppies());

  let img = document.createElement("img");
  img.setAttribute("src", "/images/bike.jpg");
  img.setAttribute("width", "300px");
  rootElement.append(img);

  rootElement.append(
    introspectESModule(`
      import { bar, bloop } from "foo";

      const vanGogh = "Van Gogh";
      const mango = "Mango";
      function cutestPuppies() {
        return [ vanGogh, mango, bar, bloop ];
      }

      export { vanGogh, mango, cutestPuppies };
    `)
  );
}

if (!window.testing) {
  boot(document.body);
}
