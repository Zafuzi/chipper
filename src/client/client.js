import {Logger, request_path} from "./lib/lib";

import "./styles/app.less";
import "./components/header/header.js";

const clientLog = new Logger("--- Client |", 5);

clientLog.info("client.js is ready...");
document.addEventListener("DOMContentLoaded", function()
{
    const route = request_path();
    clientLog.info("DOM is ready...", route);
    import(`./pages/${route}/${route}.js`);
}, false);