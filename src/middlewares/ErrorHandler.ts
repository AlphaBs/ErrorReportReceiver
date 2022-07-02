import Koa from "koa";
import { getConfig } from "../core/configManager.js";
import { logMessage, logErrorMessage } from "../core/logger.js";
import { HttpError } from "../models/HttpError.js";
import { IAppContext } from "../models/IAppContext.js";
import { IAppState } from "../models/IAppState.js";

export async function errorHandler(ctx: Koa.ParameterizedContext<IAppState, IAppContext, any>, next: Koa.Next) {
    const config = getConfig();

    try {
        await next();

        if (ctx.state.error) {
            logMessage(ctx.state.error.message);
            ctx.status = ctx.state.error.statusCode;

            if (!ctx.body)
            {
                ctx.body = {
                    result: false,
                    msg: (config.showErrorMessage) ? ctx.state.error.message : ""
                };
            }
        }
    }
    catch (e) {
        let errMsg: string = "";
        ctx.status = 500;

        logErrorMessage("Error on " + ctx.path);

        if (e instanceof HttpError)
            ctx.status = e.statusCode;
        else if (e instanceof Error)
            logErrorMessage(e.stack);
        else
            logErrorMessage(e);
        
        if (!ctx.body)
        {
            if (config.showErrorMessage) {
                if (e instanceof Error)
                    errMsg = e.toString();
                else
                    errMsg = e as string;
            }

            ctx.body = {
                result: false,
                msg: errMsg
            };
        }
    }
}