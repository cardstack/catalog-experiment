import { basename, join } from "path";
import { applyVariantToTemplateCompiler, Variant } from "@embroider/core";
import { existsSync, readFileSync } from "fs-extra";
import { transformSync } from "@babel/core";

export type FileSource =
  | string
  | { streamFile: string }
  | { status: number; message?: string };

export class Project {
  private compile: (path: string, template: string) => string;
  constructor(public localName: string, public dir: string) {
    let variant: Variant = {
      name: "default",
      runtime: "all",
      optimizeForProduction: false,
    };
    let templateCompilerFile = join(this.dir, "./_template_compiler_.js");
    if (existsSync(templateCompilerFile)) {
      let templateCompiler = require(join(
        this.dir,
        "./_template_compiler_.js"
      ));
      this.compile = applyVariantToTemplateCompiler(
        variant,
        templateCompiler.compile
      );
    } else {
      this.compile = (template: string) => template;
    }
  }

  static forDirs(dirs: string[]): Project[] {
    let usedNames = new Set<string>();
    let projects: Project[] = [];
    for (let dir of dirs) {
      let localName = basename(dir);
      let counter = 0;
      while (usedNames.has(localName)) {
        localName = `${localName}/${counter}`;
        counter++;
      }
      projects.push(new Project(localName, dir));
    }
    return projects;
  }

  outputFiles(
    inputRelativePath: string
  ): {
    outputRelativePath: string;
    load: () => FileSource;
  }[] {
    if (inputRelativePath.endsWith(".js")) {
      return [
        {
          outputRelativePath: inputRelativePath,
          load: applyBabel(this.dir, inputRelativePath),
        },
      ];
    }

    if (inputRelativePath.endsWith(".hbs")) {
      let filePath = join(this.dir, inputRelativePath);
      let template = readFileSync(filePath, "utf8");
      return [
        {
          outputRelativePath: `${inputRelativePath}.js`,
          load: () => {
            return this.compile(filePath, template);
          },
        },
      ];
    }

    return [
      {
        outputRelativePath: inputRelativePath,
        load() {
          return { streamFile: inputRelativePath };
        },
      },
    ];
  }

  loadFile(outputRelativePath: string): FileSource {
    if (outputRelativePath.endsWith(".hbs")) {
      return { status: 404 };
    }

    if (outputRelativePath.endsWith(".hbs.js")) {
      let filePath = join(this.dir, outputRelativePath.slice(0, -3));
      let template = readFileSync(filePath, "utf8");
      return this.compile(filePath, template);
    }
    if (outputRelativePath.endsWith(".js")) {
      return applyBabel(this.dir, outputRelativePath)();
    }
    return {
      streamFile: outputRelativePath,
    };
  }
}

function applyBabel(projectDir: string, relativePath: string): () => string {
  return function () {
    let filename = join(projectDir, relativePath);
    // we're depending on embroider from branch catalogjs-experiment in the
    // snowpack-experiment repo. However, the hack section in
    // adjust-imports-plugin must be enabled when we're running babel here, but
    // disabled when we're running it in the node build for importing npm
    // dependencies.
    let configFile = join(projectDir, "_babel_config_.js");
    if (existsSync(configFile)) {
      console.log(`using babel config ${configFile}`);
      let config = require(configFile);
      // This is a hack that allows us to communicate to our embroider
      // babel-config hack so that we don't have to hand edit it each time we add
      // a new pkg dep, and rather just rely on the catalogjs.lock to understand
      // our pkg deps
      process.env.CATALOGJS_LOCK_FILE = join(projectDir, "catalogjs.lock");
      return transformSync(readFileSync(filename, "utf8"), {
        ...config,
        filename,
      })!.code!;
    } else {
      return readFileSync(filename, "utf8");
    }
  };
}
