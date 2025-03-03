#!/usr/bin/env node

import Arg, { flag } from 'arg';
import buildSite from './build-site';
import { existsSync, mkdirSync, statSync } from 'fs';
import { resolve } from 'path';
import dedent from './dedent';
import * as _ from './colours';

const args = Arg({
  '--routes': String,
  '--output': String,
  '--port': Number,
  '--public': String,
  '--view-engine': String,
  '--views': String,
  '--help': Boolean,
  '--include-import-ext': Boolean,
  '--cert': String,
  '--key': String,
  '--force': String,
  '-r': '--routes',
  '-o': '--outputs',
  '-f': '--force',
  '-?': '--help',
}, {
  argv: process.argv.slice(2),
  permissive: true
});

if (args['--help']) {
  console.log(dedent`
    ${_.FG_BLUE + _.UNDERSCORE}The ${_.BRIGHT}httx${_.RESET}${_.FG_BLUE + _.UNDERSCORE} command line utility${_.RESET}

    You can use this utility to code generate Express routes from a directory structure. The
    output is written to a file which exports a function to add these routes to an existing
    Express Application or you can optionally initialise a basic development server.

    ${_.UNDERSCORE + _.BRIGHT}Arguments:${_.RESET}

    ${_.BRIGHT}--routes, -r${_.RESET}    your routes directory is ${_.FG_BLUE}(default: ./routes)${_.RESET}
    ${_.BRIGHT}--output, -o${_.RESET}    where you want to write the generated code ${_.FG_BLUE}(default: ./main.ts)${_.RESET}
    ${_.BRIGHT}--port${_.RESET},         when set a dev server is added to the output that uses this port
    ${_.BRIGHT}--public${_.RESET}        your public directory for static resources when using the dev server
                    ${_.FG_BLUE}(default: ./public)${_.RESET}
    ${_.BRIGHT}--view-engine${_.RESET}   optionally set the view engine you want the Express dev server to use
    ${_.BRIGHT}--views${_.RESET}         set the views directory to use for the view engine ${_.FG_BLUE}(default: ./views)${_.RESET}
    ${_.BRIGHT}--include-import-ext${_.RESET} when set the generated import statements will include the .js extension
    ${_.BRIGHT}--cert${_.RESET}           path to your SSL certificate file when using the dev server
    ${_.BRIGHT}--key${_.RESET}            path to your SSL key file when using the dev server
    ${_.BRIGHT}--force, -f${_.RESET}      create directories if they don't exist
    ${_.BRIGHT}--help, -?${_.RESET}      displays this message

    ${_.UNDERSCORE + _.BRIGHT}Basic usage:${_.RESET}

    Generate code for a site located in a directory ./site:
      ${_.DIM}npx${_.RESET} ${_.FG_BLUE}httx${_.RESET} ${_.FG_GRAY}--routes${_.RESET} ${_.FG_GREEN}site/routes${_.RESET} ${_.FG_GRAY}--output${_.RESET} ${_.FG_GREEN}site/main.ts${_.RESET}

    Generate code using the defaults and start a dev server on port 9000:
      ${_.DIM}npx${_.RESET} ${_.FG_BLUE}httx${_.RESET} ${_.FG_GRAY}--port${_.RESET} ${_.FG_GREEN}9000${_.RESET} ${_.FG_YELLOW}&&${_.RESET} ${_.DIM}npx${_.RESET} ${_.FG_BLUE}tsc${_.RESET} ${_.FG_GREEN}main.ts${_.RESET} ${_.FG_YELLOW}&&${_.RESET} ${_.FG_BLUE}node${_.RESET} ${_.FG_GREEN}main.js${_.RESET}

    Visit https://github.com/tonicblue/httx for more info
  `);
  process.exit(0);
}

const options = {
  routes: args['--routes'] ?? 'routes',
  output: args['--output'] ?? 'main.ts',
  port: args['--port'],
  public: args['--public'] ?? 'public',
  viewEngine: args['--view-engine'],
  views: args['--views'] ?? 'views',
  includeImportExt: args['--include-import-ext'] ?? false,
  cert: args['--cert'],
  key: args['--key'],
  force: args['--force'] ?? false,
};

if (!existsSync(options.routes))
  if (options.force)
    mkdirSync(options.routes);
  else
    throw Error (`Routes directory does not exist: ${resolve(options.routes)}`);

if (!statSync(options.routes).isDirectory())
  throw new Error(`Provided routes path is not a directory: ${resolve(options.routes)}`);

buildSite(options);