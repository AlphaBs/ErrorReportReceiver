import Koa from "koa";
import morgan from "koa-morgan";
import proxyaddr from "proxy-addr";
import { getConfig } from "./core/configManager.js";
import { IAppState } from "./models/IAppState.js";
import { IAppContext } from "./models/IAppContext.js";
import { logErrorMessage, logMessage } from "./core/logger.js";
import { promisify } from "util";
import ConfigModel from "./models/ConfigModel.js";
import { routeControllers } from "./routes.js";
import { errorHandler } from "./middlewares/ErrorHandler.js";
import { Client } from "@elastic/elasticsearch";

if (!process.env.NODE_ENV)
    process.env.NODE_ENV = "development";

const dev = process.env.NODE_ENV != "production"
console.log("[SERVER] error-report-receiver: " + process.env.NODE_ENV);

// configuration
const config: ConfigModel = getConfig();
if (config == null) {
    logErrorMessage("[FATAL] Invalid config");
    process.exit();
}

const app = new Koa<IAppState, IAppContext>();

// initializing elasticsearch client
app.context.elasticClient = new Client({
    node: config.elastic.node,
    auth: {
        username: config.elastic.username,
        password: config.elastic.password
    },
    caFingerprint: config.elastic.caFingerprint,
    tls: {
        rejectUnauthorized: false
    }
});

// proxy setting
if (config.proxy) {
    app.proxy = true;

    const trustProxy = proxyaddr.compile([
        "loopback",
        "linklocal",
        "uniquelocal"
    ]);

    morgan.token("remote-addr", (req, res) => {
        return proxyaddr(req, trustProxy);
    });
}

// logger
app.use(morgan(dev ? "dev" : "common", {
    stream: {
        write: (message: string) => logMessage(message)
    }
}));

// router
app.use(errorHandler);
routeControllers(app);

const server = app.listen(config.port, config.host, () => {
    logMessage(`[SERVER] Server started on ${config.host}:${config.port}`);

    try {
        process.send("ready"); // for process manager
    }
    catch (e) {
        logErrorMessage(e);
    }
});

// for process manager
process.on("SIGINT", async () => {
    logMessage("[SERVER] SIGINT");

    const serverClosePromise = promisify(server.close);
    //tedisPool.release();

    await serverClosePromise;
    console.log("[SERVER] EXIT");
    process.exit();
});