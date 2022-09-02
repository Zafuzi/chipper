import layout from "../client/index.html";
import header from "../client/components/header/header.html";
import footer from "../client/components/footer/footer.html";

const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const path = require("path");
const publicDir = path.resolve(__dirname, "public");
const Minimize = require("minimize");
const fs = require("fs");

const parseLayout = function (hideHeader, hideFooter)
{
    let parsed = layout;

    if(!hideHeader)
    {
        parsed = parsed.replace(/__AppHeader__/, header);
    }
    else
    {
        parsed = parsed.replace(/__AppHeader__/, "");
    }

    if(!hideFooter)
    {
        parsed = parsed.replace(/__AppFooter__/, footer);
    }
    else
    {
        parsed = parsed.replace(/__AppFooter__/, "");
    }

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

/* -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - ROUTES -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - */  
app.get("/", (request, response) =>
{
    response.send(parseLayout());
});

app.get("/about", (request, response) =>
{
    response.send(parseLayout());
});
/* -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - END ROUTES -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  - */

if(process.argv.indexOf("--dev-server") >= 0)
{
    const server = app.listen(12345, function ()
    {
        console.log(`--- App listening: http://localhost:${server.address().port}`);
        console.log(`--- Public Directory: ${publicDir}`);
        fs.stat("./dist/public/client.js", function (error, result)
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