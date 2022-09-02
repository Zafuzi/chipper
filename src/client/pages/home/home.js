import {Logger, SetPageTemplate} from "../../lib/lib";
import template from "./home.html";

const homeLog = new Logger("--- Home |", 5);

SetPageTemplate(template);
homeLog.info("Home is ready...");
