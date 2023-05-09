"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "GET",
            path: "/coursesByUser",
            handler: "custom.findByUser",
            config: {
                policies: []
            }
        }
    ],
};
