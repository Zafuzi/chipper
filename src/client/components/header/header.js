import { request_path } from "../../lib/lib";
import "./header.less";

const path = request_path();
document.querySelector(`[data-route="${path}"]`)?.classList.add("active");