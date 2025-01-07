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

export default function buildSite (options: Options) {
  const serverOptions = options.key && options.cert
    ? {
        key: Fs.readFileSync(options.key),
        cert: Fs.readFileSync(options.cert),
        requestCert: false,
        rejectUnauthorized: false
      }
    : undefined;
  const devServerTs = (options.port ? devServerRenderer(options.port, options.public, options.views, options.viewEngine, serverOptions) : '');
  const importsTs: string[] = [];
  const routesTs: string[] = [];
  const routesPath = options.routes;
  const routesFs = Fs.readdirSync(routesPath, { recursive: true, withFileTypes: true })
    .filter((dirent) => dirent.name && dirent.path && !dirent.isDirectory());

  // console.log(`### UNSORTED ROUTESFS ###`);
  // console.log(routesFs);

  // TODO: Implement better sort function to make sure static filenames take precedent over pattern matching file and directory names
  // routesFs.sort((a: Fs.Dirent, b: Fs.Dirent) => {
  //   const aPath = Path.join(a.path, a.name);
  //   const bPath = Path.join(b.path, b.name);
  //   if (aPath.includes(':'))
  //     if (bPath.includes(':')) return aPath.localeCompare(bPath);
  //     else return 1;
  //   else if (bPath.includes(':')) return -1;
  //   else return aPath.localeCompare(bPath);
  // });

  routesFs.sort((a: Fs.Dirent, b: Fs.Dirent) => {
    const aPath = Path.join(a.path, a.name).replace(/:/g, 'µ');
    const bPath = Path.join(b.path, b.name).replace(/:/g, 'µ');
    return aPath.localeCompare(bPath);
  });

  // console.log(`### SORTED ROUTESFS ###`);
  // console.log(routesFs);

  for (const { path, name } of routesFs)
    if (Path.extname(name) === '.ts') addRouteTs(Path.join(path, name));

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