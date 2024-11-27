
import Fs from 'fs';
import Path from 'path';
import Express, { type Request, type Response, type RequestHandler, type NextFunction, type Application } from 'express';
import Cors from 'cors';

// ROUTE IMPORTS
import * as __ROUTE_about_ts from './routes/about';
import * as __ROUTE_index_ts from './routes/index';
import * as __ROUTE_slug_demo_override_ts from './routes/slug-demo/override';
import * as __ROUTE_slug_demo__slug_index_ts from './routes/slug-demo/:slug/index';

export type HandlerThisArg = {
  handler: RequestHandler,
  routePath: string | RegExp,
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
loadRoute('/', __ROUTE_index_ts);
loadRoute('/slug-demo/override', __ROUTE_slug_demo_override_ts);
loadRoute('/slug-demo/:slug', __ROUTE_slug_demo__slug_index_ts);

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
    app[verb](routePath, middleware.bind({ handler, routePath }));
  }
}

// DEV SERVER

const mimeTypes: any = {
  '.3gp': 'video/3gpp',
  '.a': 'application/octet-stream',
  '.ai': 'application/postscript',
  '.aif': 'audio/x-aiff',
  '.aiff': 'audio/x-aiff',
  '.asc': 'application/pgp-signature',
  '.asf': 'video/x-ms-asf',
  '.asm': 'text/x-asm',
  '.asx': 'video/x-ms-asf',
  '.atom': 'application/atom+xml',
  '.au': 'audio/basic',
  '.avi': 'video/x-msvideo',
  '.bat': 'application/x-msdownload',
  '.bin': 'application/octet-stream',
  '.bmp': 'image/bmp',
  '.bz2': 'application/x-bzip2',
  '.c': 'text/x-c',
  '.cab': 'application/vnd.ms-cab-compressed',
  '.cc': 'text/x-c',
  '.chm': 'application/vnd.ms-htmlhelp',
  '.class': 'application/octet-stream',
  '.com': 'application/x-msdownload',
  '.conf': 'text/plain',
  '.cpp': 'text/x-c',
  '.crt': 'application/x-x509-ca-cert',
  '.css': 'text/css',
  '.csv': 'text/csv',
  '.cxx': 'text/x-c',
  '.deb': 'application/x-debian-package',
  '.der': 'application/x-x509-ca-cert',
  '.diff': 'text/x-diff',
  '.djv': 'image/vnd.djvu',
  '.djvu': 'image/vnd.djvu',
  '.dll': 'application/x-msdownload',
  '.dmg': 'application/octet-stream',
  '.doc': 'application/msword',
  '.dot': 'application/msword',
  '.dtd': 'application/xml-dtd',
  '.dvi': 'application/x-dvi',
  '.ear': 'application/java-archive',
  '.eml': 'message/rfc822',
  '.eps': 'application/postscript',
  '.exe': 'application/x-msdownload',
  '.f': 'text/x-fortran',
  '.f77': 'text/x-fortran',
  '.f90': 'text/x-fortran',
  '.flv': 'video/x-flv',
  '.for': 'text/x-fortran',
  '.gem': 'application/octet-stream',
  '.gemspec': 'text/x-script.ruby',
  '.gif': 'image/gif',
  '.gz': 'application/x-gzip',
  '.h': 'text/x-c',
  '.hh': 'text/x-c',
  '.htm': 'text/html',
  '.html': 'text/html',
  '.ico': 'image/vnd.microsoft.icon',
  '.ics': 'text/calendar',
  '.ifb': 'text/calendar',
  '.iso': 'application/octet-stream',
  '.jar': 'application/java-archive',
  '.java': 'text/x-java-source',
  '.jnlp': 'application/x-java-jnlp-file',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.log': 'text/plain',
  '.m3u': 'audio/x-mpegurl',
  '.m4v': 'video/mp4',
  '.man': 'text/troff',
  '.mathml': 'application/mathml+xml',
  '.mbox': 'application/mbox',
  '.mdoc': 'text/troff',
  '.me': 'text/troff',
  '.mid': 'audio/midi',
  '.midi': 'audio/midi',
  '.mime': 'message/rfc822',
  '.mml': 'application/mathml+xml',
  '.mng': 'video/x-mng',
  '.mov': 'video/quicktime',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.mp4v': 'video/mp4',
  '.mpeg': 'video/mpeg',
  '.mpg': 'video/mpeg',
  '.ms': 'text/troff',
  '.msi': 'application/x-msdownload',
  '.odp': 'application/vnd.oasis.opendocument.presentation',
  '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
  '.odt': 'application/vnd.oasis.opendocument.text',
  '.ogg': 'application/ogg',
  '.ogv': 'video/ogg',
  '.p': 'text/x-pascal',
  '.pas': 'text/x-pascal',
  '.pbm': 'image/x-portable-bitmap',
  '.pdf': 'application/pdf',
  '.pem': 'application/x-x509-ca-cert',
  '.pgm': 'image/x-portable-graymap',
  '.pgp': 'application/pgp-encrypted',
  '.pkg': 'application/octet-stream',
  '.pl': 'text/x-script.perl',
  '.pm': 'text/x-script.perl-module',
  '.png': 'image/png',
  '.pnm': 'image/x-portable-anymap',
  '.ppm': 'image/x-portable-pixmap',
  '.pps': 'application/vnd.ms-powerpoint',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.ps': 'application/postscript',
  '.psd': 'image/vnd.adobe.photoshop',
  '.py': 'text/x-script.python',
  '.qt': 'video/quicktime',
  '.ra': 'audio/x-pn-realaudio',
  '.rake': 'text/x-script.ruby',
  '.ram': 'audio/x-pn-realaudio',
  '.rar': 'application/x-rar-compressed',
  '.rb': 'text/x-script.ruby',
  '.rdf': 'application/rdf+xml',
  '.roff': 'text/troff',
  '.rpm': 'application/x-redhat-package-manager',
  '.rss': 'application/rss+xml',
  '.rtf': 'application/rtf',
  '.ru': 'text/x-script.ruby',
  '.s': 'text/x-asm',
  '.sgm': 'text/sgml',
  '.sgml': 'text/sgml',
  '.sh': 'application/x-sh',
  '.sig': 'application/pgp-signature',
  '.snd': 'audio/basic',
  '.so': 'application/octet-stream',
  '.svg': 'image/svg+xml',
  '.svgz': 'image/svg+xml',
  '.swf': 'application/x-shockwave-flash',
  '.t': 'text/troff',
  '.tar': 'application/x-tar',
  '.tbz': 'application/x-bzip-compressed-tar',
  '.tcl': 'application/x-tcl',
  '.tex': 'application/x-tex',
  '.texi': 'application/x-texinfo',
  '.texinfo': 'application/x-texinfo',
  '.text': 'text/plain',
  '.tif': 'image/tiff',
  '.tiff': 'image/tiff',
  '.torrent': 'application/x-bittorrent',
  '.tr': 'text/troff',
  '.txt': 'text/plain',
  '.vcf': 'text/x-vcard',
  '.vcs': 'text/x-vcalendar',
  '.vrml': 'model/vrml',
  '.war': 'application/java-archive',
  '.wav': 'audio/x-wav',
  '.webm': 'video/webm',
  '.wma': 'audio/x-ms-wma',
  '.wmv': 'video/x-ms-wmv',
  '.wmx': 'video/x-ms-wmx',
  '.wrl': 'model/vrml',
  '.wsdl': 'application/wsdl+xml',
  '.xbm': 'image/x-xbitmap',
  '.xhtml': 'application/xhtml+xml',
  '.xls': 'application/vnd.ms-excel',
  '.xml': 'application/xml',
  '.xpm': 'image/x-xpixmap',
  '.xsl': 'application/xml',
  '.xslt': 'application/xslt+xml',
  '.yaml': 'text/yaml',
  '.yml': 'text/yaml',
  '.zip': 'application/zip',
};

function setupDevServer (port: number, publicDir: string, views: string, viewEngine?: string) {
  console.log('### Creating development server with the following options', { port, publicDir, views, viewEngine, });

  const app = Express();
  app.use(Cors());
  app.use(Express.json());
  app.use(Express.urlencoded({ extended: true }));

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
    const extension = Path.extname(filePath);
    const mimeType = mimeTypes[extension] ?? 'text/plain';

    if (Fs.existsSync(filePath)) {
      res.contentType(mimeType);
      res.send(Fs.readFileSync(filePath));
    } else res.status(404).send();
  });
}

setupDevServer(
  9000,
  "demo/public",
  "views",
  undefined
)

