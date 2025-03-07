// path: ./config/plugins.js

module.exports = ({ env }) => ({
    upload: {
        config: {
            provider: 'aws-s3',
            providerOptions: {
                accessKeyId: env('AWS_ACCESS_KEY_ID'),
                secretAccessKey: env('AWS_ACCESS_SECRET'),
                region: env('AWS_REGION'),
                params: {
                    Bucket: env('AWS_BUCKET'),
                    ContentDisposition: 'attachment'
                },
            },
            actionOptions: {
                upload: {},
                uploadStream: {},
                delete: {},
            },
        },
    },
    placeholder: {
        enabled: true,
        config: {
            size: 10,
        },
    },
});
