import {Logger, SetPageTemplate} from "../../lib/lib";
import template from "./about.html";

const aboutLog = Logger("--- About |", 5);

SetPageTemplate(template);
aboutLog.info("About is ready...");