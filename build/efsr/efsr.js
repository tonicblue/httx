#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const arg_1 = __importDefault(require("arg"));
const build_site_1 = __importDefault(require("./build-site"));
const node_child_process_1 = require("node:child_process");
const args = (0, arg_1.default)({
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
};
(0, build_site_1.default)(options);
if (options.buildCommand || options.port) {
    (0, node_child_process_1.execSync)(options.buildCommand || 'tsc -p tsconfig.site.json');
    if (options.port)
        (0, node_child_process_1.execSync)('node build/site/main.js');
}
//# sourceMappingURL=efsr.js.map