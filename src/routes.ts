import Koa from "koa";

import root from './routes/root.js';

export function routeControllers(app: Koa) {
    app.use(root.routes());  
}