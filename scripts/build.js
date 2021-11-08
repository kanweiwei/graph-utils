const rollup = require("rollup");
const typescript = require("@rollup/plugin-typescript");
const minimist = require("minimist");
const argv = minimist(process.argv);
console.log(argv);
// see below for details on the options
let inputOptions = {};
let outputOptions = {};

if (argv.dir === "es") {
  inputOptions = {
    input: "./src/index.ts",
    plugins: [
      typescript({
        lib: ["es5", "es6", "dom"],
        target: "es5",
        outDir: "es",
      }),
    ],
  };
  outputOptions = {
    format: "esm",
    dir: "es",
  };
} else if (argv.dir == "lib") {
  inputOptions = {
    input: "./src/index.ts",
    plugins: [
      typescript({
        lib: ["es5", "es6", "dom"],
        target: "es5",
        outDir: "lib",
      }),
    ],
  };
  outputOptions = {
    format: "cjs",
    dir: "lib",
  };
} else {
  inputOptions = {
    input: "./src/index.ts",
    plugins: [
      typescript({
        lib: ["es5", "es6", "dom"],
        target: "es5",
        outDir: "umd",
        declaration: false,
      }),
    ],
  };
  outputOptions = {
    format: "umd",
    dir: "umd",
    name: "GraphUtils",
  };
}

async function build() {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions);

  console.log(bundle.watchFiles); // an array of file names this bundle depends on

  // generate output specific code in-memory
  // you can call this function multiple times on the same bundle object
  await bundle.generate(outputOptions);

  // or write the bundle to disk
  await bundle.write(outputOptions);

  // closes the bundle
  await bundle.close();
}

build();
