import path from "path";
import { color } from "./colors.mjs";
import { pathToFileURL } from "url";

// let anyFailures = false;
let successes = 0;
let failures = 0;

const exitCodes = {
  ok: 0,
  failures: 1,
};

export const run = async () => {
  try {
    await import(
      // path.resolve(process.cwd(), "test/tests.mjs")
      pathToFileURL(path.resolve(process.cwd(), "test/tests.mjs"))

    );
  } catch (e) {
    console.error(e);
  }
  console.log(
    color(
      `<green>${successes}</green> tests passed, <red>${failures}</red> tests failed.`
    )
  );
  process.exit(
    // anyFailures? exitCodes.failures: exitCodes.ok
    failures !== 0 ? exitCodes.failures : exitCodes.ok
  );
};

export const it = (name, body) => {
  try{
    body();
  }catch(e){
    console.error(color(`<red>${name}</red>`));
    console.error(e);
    // anyFailures = true;
    failures++;
   }
};

// export const it = (name, body) => {
//   try {
//     body();
//     successes++;
//   } catch (e) {
//     console.error(color(`  <red>✗</red> ${name}`));
//     console.error(e);
//     failures++;
//   }
// };
