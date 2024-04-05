import Fs from 'fs';
import Path from 'path';
import Express, { type Request, type Response, type RequestHandler, type NextFunction, type Application } from 'express';

import * as __ROUTE_ from './routes';
import * as __ROUTE__slug_ from './routes/[slug]';

export type HandlerThisArg = {
  handler: RequestHandler,
}
export type HttpVerb = 'get' | 'post' | 'delete' | 'put' | 'patch' | 'options' | 'head' | 'all';
export type Route = {
  verb: HttpVerb,
  routePath: string | RegExp,
  handler: RequestHandler,
};

const httpVerbs: HttpVerb[] = ['get', 'post', 'delete', 'put', 'patch', 'options', 'head', 'all'];
const routes: Route[] = [];

loadRoute('/', __ROUTE_);
loadRoute('/:slug', __ROUTE__slug_);

/* @ts-ignore */
function loadRoute (routePath: string | RegExp, routeHandler: any) {
  for (const verb of httpVerbs)
    if (verb in routeHandler) routes.push({ verb, routePath, handler: routeHandler[verb] });
}

async function middleware (this: HandlerThisArg, req: Request, res: Response, next: NextFunction): Promise<any> {
  try {
    await this.handler(req, res, next);
  } catch (err: any) {
    res
      .status(err?.status ?? 500)
      .send(err?.message ?? 'Something bad happened');
  }
}

export function addRoutesToApp (app: Application) {
  for (const { verb, routePath, handler } of routes) {
    console.log(`Adding route ${verb.toUpperCase()} ${routePath}`);
    app[verb](routePath, middleware.bind({ handler }));
  }
}

function setupDevServer (port: number) {
  const app = Express();

  addRoutesToApp(app);
  app.listen(port, () => console.log('Site running on port', port));

  // Basic public directory file server
  app.get(/.*/, (req: Express.Request, res: Express.Response) => {
    const url = new URL(req.url, 'https://' + req.headers.host);
    const publicPath = Path.join('site', 'public', url.pathname);

    if (Fs.existsSync(publicPath)) res.send(Fs.readFileSync(publicPath));
    else res.status(404).send();
  });

  return app;
}

setupDevServer(9090);