"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [
    'strapi::errors',
    {
        name: 'strapi::security',
        config: {
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    'connect-src': ["'self'", 'https:', 'http:'],
                    'img-src': [
                        "'self'",
                        'data:',
                        'blob:',
                        'dl.airtable.com',
                        'the-great-sync-bucket.s3.amazonaws.com',
                    ],
                    'media-src': [
                        "'self'",
                        'data:',
                        'blob:',
                        'dl.airtable.com',
                        'the-great-sync-bucket.s3.amazonaws.com',
                    ],
                    upgradeInsecureRequests: null,
                },
            },
        },
    },
    'strapi::cors',
    'strapi::poweredBy',
    'strapi::logger',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
];
