import Fs from 'node:fs';
import Path from 'node:path';
import devServerRenderer from './templates/dev-server';
import mainRenderer from './templates/main';

export type Options = {
  routes: string;
  output: string;
  port?: number;
  viewEngine?: string;
  views: string;
  public: string;
  includeImportExt: boolean;
  key?: string;
  cert?: string;
};

function comparablePath (dirent: Fs.Dirent) {
  return Path
    .join(dirent.parentPath, dirent.name)
    .replace(/:/g, 'µ')
    .replace(/([^\/]+?)\//g, 'µ$1/');
}

export default function buildSite (options: Options) {
  const serverOptions = options.key && options.cert
    ? {
        key: options.key,
        cert: options.cert,
        requestCert: false,
        rejectUnauthorized: false
      }
    : undefined;
  const devServerTs = (options.port ? devServerRenderer(options.port, options.public, options.views, options.viewEngine, serverOptions) : '');
  const importsTs: string[] = [];
  const routesTs: string[] = [];
  const routesPath = options.routes;
  const routesFs = Fs.readdirSync(routesPath, { recursive: true, withFileTypes: true })
    .filter((dirent) => dirent.name && dirent.parentPath && !dirent.isDirectory());

  console.log(`### UNSORTED ROUTESFS ###`);
  console.log('\t' + routesFs.map(dirent => Path.join(dirent.parentPath, dirent.name)).join('\n\t'));

  routesFs.sort((a: Fs.Dirent, b: Fs.Dirent) => {
    const aPath = comparablePath(a);
    const bPath = comparablePath(b);

    return aPath.localeCompare(bPath);
  });

  console.log(`### SORTED ROUTESFS ###`);
  console.log('\t' + routesFs.map(dirent => Path.join(dirent.parentPath, dirent.name)).join('\n\t'));

  for (const { parentPath, name } of routesFs)
    if (Path.extname(name) === '.ts') addRouteTs(Path.join(parentPath, name));

  const generatedCode = mainRenderer(importsTs.join('\n'), routesTs.join('\n'), devServerTs);
  Fs.writeFileSync(options.output, generatedCode);

  return generatedCode;

  function addRouteTs (path: string) {
    const outputDir = Path.dirname(options.output);
    const routes = Path.relative(outputDir, options.routes);
    const relativeRoutePath = Path.relative(options.routes, path);
    const pathPattern = '/' + (
      relativeRoutePath.replaceAll(Path.sep, '/')
        .replace(/\.ts$/, '')
        .replace(/index$/, '')
        .replace(/\/$/, '')
    );
    const ext = options.includeImportExt ? '.js' : '';
    const importPath = Path.relative(outputDir, path).replace(/\.ts$/, '') + ext;
    const importName = `__ROUTE_${relativeRoutePath.replace(/[^a-z0-9_]/g, '_')}`;

    console.log('### ADD ROUTE TS ###', {
      path,
      outputDir,
      routes,
      relativeRoutePath,
      pathPattern,
      importPath,
      importName,
    })

    importsTs.push(`import * as ${importName} from './${importPath}';`);
    routesTs.push(`loadRoute('${pathPattern}', ${importName});`);
  }
}