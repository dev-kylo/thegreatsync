const fs = require('fs');
const path = require('path')

export default ({ env }) => ({
    connection: {
        client: 'postgres',
        connection: {
            host: env('LOCAL_DATABASE_HOST'),
            port: env.int('LOCAL_DATABASE_PORT'),
            database: env('LOCAL_DATABASE_NAME'),
            user: env('LOCAL_DATABASE_USERNAME'),
            password: env('LOCAL_DATABASE_PASSWORD'),
            ssl: false
            // ssl: {
            //     rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false), // For self-signed certificates
            // }, 
        },
    },
});
