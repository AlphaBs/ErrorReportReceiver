import Router from "koa-router";
import { getConfig } from "../core/configManager.js";
import { IAppContext } from "../models/IAppContext.js";
import { IAppState } from "../models/IAppState.js";
import koaBody from "koa-body";

const config = getConfig();
const router = new Router<IAppState, IAppContext>();

router.use(koaBody());

router.post("/report", async (ctx, next) => {
    const body = ctx.request.body;

    await ctx.elasticClient.index({
        index: config.elastic.index,
        document: {
            "appName": body.appName,
            "appVersion": body.appVersion,
            "clientId": body.clientId,
            "osname": body.osname,
            "@timestamp": body.time,
            "traceId": body.traceId,
            "errorId": body.error.id,
            "errorLog": body.error.log
        }
    });

    ctx.body = { result: true };
    await next();
});

router.get("/version", async (ctx, next) => {
    ctx.body = config.version;
    await next();
});

router.get("/test", async (ctx, next) => {
    ctx.body = "test";
    await next();
});

export default router;