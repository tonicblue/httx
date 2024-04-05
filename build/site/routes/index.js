"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
async function get(req, res) {
    res.send(`<h1>Test: ${req.url} - ${req.params.slug}</h1><p>It worked!</p>`);
}
exports.get = get;
//# sourceMappingURL=index.js.map