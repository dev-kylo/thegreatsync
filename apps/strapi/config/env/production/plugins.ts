
module.exports = ({ env }) => ({

    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: env('PROD_SMTP_HOST'),
          port: env('PROD_SMTP_PORT', 587),
          auth: {
            user: env('PROD_SMTP_USERNAME'),
            pass: env('PROD_SMTP_PASSWORD'),
          },
        },
        settings: {
          defaultFrom: 'kylo@thegreatsync.com',
          defaultReplyTo: 'kylo@thegreatsync.com',
        },
      },
    },
    backup: {
      enabled: true,
      cronSchedule: '0 0 * * *',
      storageService: 'aws-s3',
      awsAccessKeyId: env('AWS_ACCESS_KEY_ID'),
      awsSecretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
      awsRegion: 'us-east-1',
      awsS3Bucket: 'the-great-sync-backups',
      databaseDriver: 'pg', // 'pg' for PostgreSQL
      pgDumpExecutable: '/usr/bin/pg_dump', // Path for pg_dump
      pgDumpOptions: [
        '--no-owner',
        '--clean'
      ],
      allowCleanup: true,
      timeToKeepBackupsInSeconds: 172800, // 2 days
      cleanupCronSchedule: '0 1 * * *', // Every day at 1 AM
      errorHandler: (error, strapi) => {
        console.error("Database Backup Error:", error);
      },
    }

});