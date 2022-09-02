const esbuild = require("esbuild");
const copyPlugin = require("esbuild-copy-static-files");
const lessPlugin = require("esbuild-plugin-less");
const fs = require("fs");
const path = require("path");


const doBuild = process.argv.indexOf("--build") !== -1;
const doWatch = process.argv.indexOf("--watch") !== -1;

console.log(`Build: ${doBuild}`);
console.log(`Watch: ${doWatch}`);

async function getFiles(path)
{
    if(!path)
    {
        console.error("Please pass a path to use getFiles");
        return null;
    }
    
    const entries = fs.readdirSync(path, {withFileTypes: true});

    // Get files within the current directory and add a path key to the file objects
    const files = entries.filter(file => !file.isDirectory()).map(file => ({...file, path: path + file.name}));

    // Get folders within the current directory
    const folders = entries.filter(folder => folder.isDirectory());

    for(const folder of folders)
        /*
          Add the found files within the subdirectory to the files array by calling the
          current function itself
        */{
        files.push(...await getFiles(`${path}${folder.name}/`));
    }

    return files;
}

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


// get all of our client js and send them to dist/public/
getFiles("./src/client/").then(files => {
    let js = files.filter(file => {
        return path.extname(file.name) === ".js";
    });
    
    js = js.map(file =>
    {
        return file.path;
    })

    esbuild.build({
        entryPoints: ['./src/client/client.js', ...js],
        bundle: true,
        minify: doBuild,
        watch: doWatch,
        platform: "browser",
        plugins: [
            copyPlugin({
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
            }), lessPlugin.lessLoader()
        ],
        loader: {
            ".html": "text"
        },
        outdir: './dist/public'
    }).catch(() => process.exit(1));
});