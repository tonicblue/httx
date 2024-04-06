import Fs from 'fs';
import Path from 'path';
import Express, { type Request, type Response, type RequestHandler, type NextFunction, type Application } from 'express';

// ROUTE IMPORTS
import * as __ROUTE_about_ts from './routes/about';
import * as __ROUTE__slug_index_ts from './routes/index';

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

// LOAD ROUTES
loadRoute('/about', __ROUTE_about_ts);
loadRoute('/:slug', __ROUTE__slug_index_ts);

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

// DEV SERVER

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
      3000, 
      "public", 
      "views", 
      undefined
    )
  