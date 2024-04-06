#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const arg_1 = __importDefault(require("arg"));
const build_site_1 = __importDefault(require("./build-site"));
const args = (0, arg_1.default)({
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
(0, build_site_1.default)(options);
//# sourceMappingURL=httx.js.map