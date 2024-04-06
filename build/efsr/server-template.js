"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRoutesToApp = void 0;
const httpVerbs = ['get', 'post', 'delete', 'put', 'patch', 'options', 'head', 'all'];
const routes = [];
/* routes */
/* @ts-ignore */
function loadRoute(routePath, routeHandler) {
    for (const verb of httpVerbs)
        if (verb in routeHandler)
            routes.push({ verb, routePath, handler: routeHandler[verb] });
}
async function middleware(req, res, next) {
    try {
        await this.handler(req, res, next);
    }
    catch (err) {
        res
            .status(err?.status ?? 500)
            .send(err?.message ?? 'Something bad happened');
    }
}
function addRoutesToApp(app) {
    for (const { verb, routePath, handler } of routes) {
        console.log(`Adding route ${verb.toUpperCase()} ${routePath}`);
        app[verb](routePath, middleware.bind({ handler }));
    }
}
exports.addRoutesToApp = addRoutesToApp;
/* devServer */ 
//# sourceMappingURL=server-template.js.map