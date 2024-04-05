import Fs from 'node:fs';
import Path from 'node:path';

export type Options = {
  routes: string;
  output: string;
  buildCommand?: string;
  port?: number;
};

export default function buildSite (options: Options) {
  const importsTs: string[] = [];
  const routesTs: string[] = [];
  const routesPath = options.routes;
  const routesFs = Fs.readdirSync(routesPath, { recursive: true, withFileTypes: true });

  for (const { name, path } of routesFs)
    if (name === 'index.ts') addRouteTs(path);

  const serverTemplatePath = Path.join('src', 'server-template.ts');
  const serverTemplate = Fs.readFileSync(serverTemplatePath).toString();
  const generatedCode = serverTemplate
    .replace('/* imports */', importsTs.join('\n'))
    .replace('/* routes */', routesTs.join('\n'));

  Fs.writeFileSync(options.output, generatedCode);

  return generatedCode;

  function addRouteTs (path: string) {
    const outputDir = Path.dirname(options.output);
    const routes = Path.relative(outputDir, options.routes);
    const relativeRoutePath = Path.relative(options.routes, path);
    const pathPattern = convertPathToPattern(`/${relativeRoutePath}`);
    const importPath = Path.join(routes, relativeRoutePath);
    const importName = `__ROUTE_${relativeRoutePath.replace(/[^a-z0-9_]/g, '_')}`;

    importsTs.push(`import * as ${importName} from './${importPath}';`);
    routesTs.push(`loadRoute('${pathPattern}', ${importName});`);
  }

  function convertPathToPattern (path: string) {
    return path.replace(/(\[)([a-z0-9_-]+)(\])/gi, ':$2');
  }
}