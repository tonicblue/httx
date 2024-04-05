#!/usr/bin/env node

import Arg from 'arg';
import buildSite from './build-site';
import { execSync } from 'node:child_process';

const args = Arg({
  '--routes': String,
  '--output': String,
  '--build-command': String,
  '--port': Number,

  '-r': '--routes',
  '-o': '--outputs'
}, {
  argv: process.argv.slice(2)
});

const options = {
  routes: args['--routes'] ?? 'site/routes',
  output: args['--output'] ?? 'site/main.ts',
  buildCommand: args['--build-command'],
  port: args['--port']
}

buildSite(options);

// TODO: Make this a generate server option that adds setupDevServer to main.ts
if (options.buildCommand || options.port) {
  execSync(options.buildCommand || 'tsc -p tsconfig.site.json');

  if (options.port)
    execSync('node build/site/main.js');
}