"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'PUT',
            path: '/user-course-progress',
            handler: 'custom.updateUserCompletionData',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
