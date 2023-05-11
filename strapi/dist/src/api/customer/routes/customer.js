"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'POST',
            path: '/customer/createOrder',
            handler: 'customer.createOrder',
            config: {
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/customer/register',
            handler: 'customer.register',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};
