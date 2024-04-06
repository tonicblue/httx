"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
function buildSite(options) {
    const importsTs = [];
    const routesTs = [];
    const routesPath = options.routes;
    const routesFs = node_fs_1.default.readdirSync(routesPath, { recursive: true, withFileTypes: true });
    for (const { name, path } of routesFs)
        if (node_path_1.default.extname(path) === '.ts')
            addRouteTs(path);
    const devServerTemplate = /*javascript*/ `
    function setupDevServer (port: number) {
      const app = Express();

      addRoutesToApp(app);

      app.listen(port, () => console.log('Site running on port', port));

      // Basic public directory file server
      app.get(/.*/, (req: Express.Request, res: Express.Response) => {
        const url = new URL(req.url, 'https://' + req.headers.host);
        const publicPath = Path.join(${JSON.stringify(options.public)}, url.pathname);

        if (Fs.existsSync(publicPath)) res.send(Fs.readFileSync(publicPath));
        else res.status(404).send();
      });
    }

    setupDevServer(${options.port})
  `;
    const devServerTs = options.port
        ? devServerTemplate
        : '';
    const serverTemplatePath = node_path_1.default.join('src', 'server-template.ts');
    const serverTemplate = node_fs_1.default.readFileSync(serverTemplatePath).toString();
    const generatedCode = serverTemplate
        .replace('/* imports */', importsTs.join('\n'))
        .replace('/* routes */', routesTs.join('\n'))
        .replace('/* devServer */', devServerTs);
    node_fs_1.default.writeFileSync(options.output, generatedCode);
    return generatedCode;
    function addRouteTs(path) {
        const outputDir = node_path_1.default.dirname(options.output);
        const routes = node_path_1.default.relative(outputDir, options.routes);
        const relativeRoutePath = node_path_1.default.relative(options.routes, path);
        const pathPattern = `/${relativeRoutePath.replaceAll(node_path_1.default.sep, '/')}` + (path.endsWith('index.ts')
            ? ''
            : node_path_1.default.basename(path, '.ts'));
        const importPath = node_path_1.default.join(routes, relativeRoutePath);
        const importName = `__ROUTE_${relativeRoutePath.replace(/[^a-z0-9_]/g, '_')}`;
        importsTs.push(`import * as ${importName} from './${importPath}';`);
        routesTs.push(`loadRoute('${pathPattern}', ${importName});`);
    }
}
exports.default = buildSite;
//# sourceMappingURL=build-site.js.map