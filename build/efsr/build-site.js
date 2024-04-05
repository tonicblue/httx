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
        if (name === 'index.ts')
            addRouteTs(path);
    const serverTemplatePath = node_path_1.default.join('src', 'server-template.ts');
    const serverTemplate = node_fs_1.default.readFileSync(serverTemplatePath).toString();
    const generatedCode = serverTemplate
        .replace('/* imports */', importsTs.join('\n'))
        .replace('/* routes */', routesTs.join('\n'));
    node_fs_1.default.writeFileSync(options.output, generatedCode);
    return generatedCode;
    function addRouteTs(path) {
        const outputDir = node_path_1.default.dirname(options.output);
        const routes = node_path_1.default.relative(outputDir, options.routes);
        const relativeRoutePath = node_path_1.default.relative(options.routes, path);
        const pathPattern = convertPathToPattern(`/${relativeRoutePath}`);
        const importPath = node_path_1.default.join(routes, relativeRoutePath);
        const importName = `__ROUTE_${relativeRoutePath.replace(/[^a-z0-9_]/g, '_')}`;
        importsTs.push(`import * as ${importName} from './${importPath}';`);
        routesTs.push(`loadRoute('${pathPattern}', ${importName});`);
    }
    function convertPathToPattern(path) {
        return path.replace(/(\[)([a-z0-9_-]+)(\])/gi, ':$2');
    }
}
exports.default = buildSite;
//# sourceMappingURL=build-site.js.map