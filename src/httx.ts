#!/usr/bin/env node

import Arg from 'arg';
import buildSite from './build-site';
import { existsSync, statSync } from 'fs';
import { resolve } from 'path';

const args = Arg({
  '--routes': String,
  '--output': String,
  '--port': Number,
  '--public': String,
  '-r': '--routes',
  '-o': '--outputs'
}, {
  argv: process.argv.slice(2)
});

const options = {
  routes: args['--routes'] ?? 'routes',
  output: args['--output'] ?? 'main.ts',
  port: args['--port'],
  public: args['--public'] ?? 'public',
};

if (!existsSync(options.routes))
  throw Error (`Routes directory does not exist: ${resolve(options.routes)}`);

if (!statSync(options.routes).isDirectory())
  throw new Error(`Provided routes path is not a directory: ${resolve(options.routes)}`);

buildSite(options);