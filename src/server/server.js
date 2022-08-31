import layout from "../client/index.html";
import header from "../client/components/header/header.html";

const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const path = require("path");
const publicDir = path.resolve(__dirname, "public");
const Minimize = require("minimize");
const fs = require("fs");

const parseLayout = function (template)
{
    if(!template)
    {
        return layout;
    }

    let parsed = layout;

    parsed = parsed.replace(/__AppHeader__/, header);
    parsed = parsed.replace(/__AppBody__/, template);
    parsed = parsed.replace(/__AppFooter__/, "");
    parsed = new Minimize().parse(parsed);

    console.log(`\tparseLayout.html: ${Buffer.byteLength(parsed)} bytes`);
    return parsed;
}

app.use('/public', express.static(publicDir));

app.use(function(req, res, next)
{
    console.log(`\n--- ${req.method} | ${req.url}`);
    next();
});

app.get("/", (request, response) =>
{
    response.setHeader('Content-Type', 'text/html');
    response.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    response.send(parseLayout(require("../client/pages/home.html")));
});

app.get("/about", (request, response) =>
{
    response.setHeader('Content-Type', 'text/html');
    response.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    response.send(parseLayout(require("../client/pages/about.html")));
});

if(process.argv.indexOf("--dev-server") >= 0)
{
    const server = app.listen(12345, function ()
    {
        console.log(`--- App listening: http://localhost:${server.address().port}`);
        console.log(`--- Public Directory: ${publicDir}`);
        fs.stat("./dist/public/client.min.js", function (error, result)
        {
            if (error)
            {
                throw "client.min.js is missing";
            }

            console.log(`--- client.min.js: ${result.size} bytes`);
        });
    });
}

module.exports = app;