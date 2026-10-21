import { defineHandler } from "nitro";
import { proxyApex } from "../../apex-proxy.mjs";

export default defineHandler((event) => proxyApex(event.req));
