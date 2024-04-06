#!/usr/bin/env node

import Arg, { flag } from 'arg';
import buildSite from './build-site';
import { existsSync, statSync } from 'fs';
import { resolve } from 'path';

const args = Arg({
  '--routes': String,
  '--output': String,
  '--port': Number,
  '--public': String,
  '--view-engine': String,
  '--views': String,
  '--help': flag,
  '-r': '--routes',
  '-o': '--outputs',
  '-?': '--help',
}, {
  argv: process.argv.slice(2)
});

if (args['--help']) {
  console.log(`Help text`)
}

const options = {
  routes: args['--routes'] ?? 'routes',
  output: args['--output'] ?? 'main.ts',
  port: args['--port'],
  public: args['--public'] ?? 'public',
  viewEngine: args['--view-engine'],
  views: args['--views'] ?? 'views',
};

if (!existsSync(options.routes))
  throw Error (`Routes directory does not exist: ${resolve(options.routes)}`);

if (!statSync(options.routes).isDirectory())
  throw new Error(`Provided routes path is not a directory: ${resolve(options.routes)}`);

buildSite(options);