import Fs from 'node:fs';
import Path from 'node:path';

export type Options = {
  routes: string;
  output: string;
  port?: number;
  public: string;
};

export default function buildSite (options: Options) {
  const importsTs: string[] = [];
  const routesTs: string[] = [];
  const routesPath = options.routes;
  const routesFs = Fs.readdirSync(routesPath, { recursive: true, withFileTypes: true });

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

  for (const { name, path } of routesFs)
    if (Path.extname(name) === '.ts') addRouteTs(Path.join(path, name));

  const devServerTemplate = /*javascript*/`
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
  const serverTemplatePath = Path.join('src', 'server-template.ts');
  const serverTemplate = Fs.readFileSync(serverTemplatePath).toString();
  const generatedCode = serverTemplate
    .replace('/* imports */', importsTs.join('\n'))
    .replace('/* routes */', routesTs.join('\n'))
    .replace('/* devServer */', devServerTs);

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