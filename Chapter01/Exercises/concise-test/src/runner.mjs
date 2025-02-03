import path from "path";

import { pathToFileURL } from "url";



export const run = async () => {
  try {
    await import(
        pathToFileURL(path.resolve(process.cwd(), "test/tests.mjs"))
      );
  } catch (e) {
    console.error(e);
  }
  console.log("Test run finished");
};

// export const run = () => console.log("hello, world!");

