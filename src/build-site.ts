import Fs from 'node:fs';
import Path from 'node:path';
import Dedent from './dedent';

export type Options = {
  routes: string;
  output: string;
  port?: number;
  viewEngine?: string;
  views: string;
  public: string;
};

export default function buildSite (options: Options) {
  const importsTs: string[] = [];
  const routesTs: string[] = [];
  const routesPath = options.routes;
  const routesFs = Fs.readdirSync(routesPath, { recursive: true, withFileTypes: true })
    .filter((dirent) => dirent.name && dirent.path && !dirent.isDirectory());

  // TODO: Work out why my dummy index route is being lost

  // console.log(`### UNSORTED ROUTESFS ###`);
  // console.log(routesFs);

  // TODO: Implement better sort function to make sure static filenames take precedent over pattern matching file and directory names
  routesFs.sort((a: Fs.Dirent, b: Fs.Dirent) => {
    const aPath = Path.join(a.path, a.name);
    const bPath = Path.join(b.path, b.name);
    if (aPath.includes(':'))
      if (bPath.includes(':')) return aPath.localeCompare(bPath);
      else return 1;
    else if (bPath.includes(':')) return -1;
    else return aPath.localeCompare(bPath);
  });

  // console.log(`### SORTED ROUTESFS ###`);
  // console.log(routesFs);

  for (const { path, name } of routesFs)
    if (Path.extname(name) === '.ts') addRouteTs(Path.join(path, name));

  const devServerTemplate = Dedent/*javascript*/`
    function setupDevServer (port: number, publicDir: string, views: string, viewEngine?: string) {
      console.log('### Creating development server with the following options', { port, publicDir, views, viewEngine, });

      const app = Express();

      addRoutesToApp(app);

      if (viewEngine) {
        app.set('view engine', viewEngine);
        app.set('views', views);
      }

      app.listen(port, () => console.log('Site running on port', port));

      // Basic public directory file server
      app.get(/.*/, (req: Express.Request, res: Express.Response) => {
        const url = new URL(req.url, 'https://' + req.headers.host);
        const filePath = Path.join(publicDir, url.pathname);

        if (Fs.existsSync(filePath)) res.send(Fs.readFileSync(filePath));
        else res.status(404).send();
      });
    }

    setupDevServer(
      ${options.port},
      ${JSON.stringify(options.public)},
      ${JSON.stringify(options.views)},
      ${JSON.stringify(options.viewEngine)}
    )
  `;

  const devServerTs = (options.port ? devServerTemplate : '');
  const serverTemplatePath = Path.join('src', 'server-template.ts');
  const serverTemplate = Fs.readFileSync(serverTemplatePath).toString();
  const generatedCode = (serverTemplate
    .replace('/* imports */', importsTs.join('\n'))
    .replace('/* routes */', routesTs.join('\n'))
    .replace('/* devServer */', devServerTs)
  );

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
    const importPath = Path.join(routes, Path.basename(relativeRoutePath, '.ts'));
    const importName = `__ROUTE_${relativeRoutePath.replace(/[^a-z0-9_]/g, '_')}`;

    console.log('### ADD ROUTE TS ###', {
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