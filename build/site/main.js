"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRoutesToApp = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
// ROUTE IMPORTS
const __ROUTE_about_ts = __importStar(require("./routes/about"));
const __ROUTE_index_ts = __importStar(require("./routes/index"));
const __ROUTE__slug_index_ts = __importStar(require("./routes/index"));
const httpVerbs = ['get', 'post', 'delete', 'put', 'patch', 'options', 'head', 'all'];
const routes = [];
// LOAD ROUTES
loadRoute('/about', __ROUTE_about_ts);
loadRoute('/', __ROUTE_index_ts);
loadRoute('/:slug', __ROUTE__slug_index_ts);
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
function setupDevServer(port) {
    const app = (0, express_1.default)();
    addRoutesToApp(app);
    app.listen(port, () => console.log('Site running on port', port));
    // Basic public directory file server
    app.get(/.*/, (req, res) => {
        const url = new URL(req.url, 'https://' + req.headers.host);
        const publicPath = path_1.default.join("public", url.pathname);
        if (fs_1.default.existsSync(publicPath))
            res.send(fs_1.default.readFileSync(publicPath));
        else
            res.status(404).send();
    });
}
setupDevServer(9090);
//# sourceMappingURL=main.js.map