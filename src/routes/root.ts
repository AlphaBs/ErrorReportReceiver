import Router from "koa-router";
import { getConfig } from "../core/configManager.js";
import { IAppContext } from "../models/IAppContext.js";
import { IAppState } from "../models/IAppState.js";
import koaBody from "koa-body";
import { HttpError } from "../models/HttpError.js";

const config = getConfig();
const router = new Router<IAppState, IAppContext>();

router.use(koaBody());

router.post("/report", async (ctx, next) => {
    const body = ctx.request.body;
    const documentId = body.traceId;

    if (!documentId || typeof documentId !== "string")
        throw new HttpError("require traceId property", "badrequest", 400)

    await ctx.elasticClient.create({
        index: config.elastic.index,
        id: documentId,
        document: {
            "appName": body.appName,
            "appVersion": body.appVersion,
            "clientId": body.clientId,
            "osname": body.osname,
            "@timestamp": body.time,
            "errorId": body.error.id,
            "errorLog": body.error.log
        }
    });

    ctx.body = { result: true };
    await next();
});

router.post("/test-report", async (ctx, next) => {
    const body = ctx.request.body;
    const documentId = body.traceId;

    if (!documentId || typeof documentId !== "string")
        throw new HttpError("require traceId property", "badrequest", 400)

    ctx.body = {
        index: config.elastic.index,
        id: documentId,
        document: {
            "appName": body.appName,
            "appVersion": body.appVersion,
            "clientId": body.clientId,
            "osname": body.osname,
            "@timestamp": body.time,
            "errorId": body.error.id,
            "errorLog": body.error.log
        }
    };
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