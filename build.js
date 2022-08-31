const esbuild = require("esbuild");
const copyPlugin = require("esbuild-copy-static-files");
const lessPlugin = require("esbuild-plugin-less");

const doBuild = process.argv.indexOf("--build") !== -1;
const doWatch = process.argv.indexOf("--watch") !== -1;

console.log(`Build: ${doBuild}`);
console.log(`Watch: ${doWatch}`);

esbuild.build({
    entryPoints: ['./src/server/server.js'],
    bundle: true,
    minify: doBuild,
    watch: doWatch,
    loader: {
        ".html": "text"
    },
    platform: "node",
    outfile: './dist/index.js',
}).catch(() => process.exit(1))

esbuild.build({
    entryPoints: ['./src/client/client.js'],
    bundle: true,
    minify: doBuild,
    watch: doWatch,
    platform: "browser",
    plugins: [copyPlugin({
        src: './src/public',
        dest: './dist/public',
        dereference: true,
        errorOnExist: false,
        preserveTimestamps: true,
        recursive: true,
        force: true,
        filter: function()
        {
            return true;
        }
    }), lessPlugin.lessLoader()],
    loader: {
        ".html": "text"
    },
    outfile: './dist/public/client.min.js',

}).catch(() => process.exit(1))