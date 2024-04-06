#!/usr/bin/env node

import Arg from 'arg';
import buildSite from './build-site';
import { execSync } from 'node:child_process';

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
}

buildSite(options);