
module.exports = ({ env }) => ({
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: env('PROD_SMTP_HOST') || 'smtp.postmarkapp.com',
          port: Number(env('PROD_SMTP_PORT') || 2525), // try 2525 first
          secure: false,        
          auth: {
            user: env('PROD_SMTP_USERNAME'),
            pass: env('PROD_SMTP_PASSWORD'), 
          },
          family: 4,   // force IPv4 (avoid IPv6 blackhole)
          requireTLS: true,  // STARTTLS for 2525/587
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 20000,
          tls: { minVersion: 'TLSv1.2', servername: 'smtp.postmarkapp.com' },
        },
        settings: {
          defaultFrom: 'kylo@thegreatsync.com',
          defaultReplyTo: 'kylo@thegreatsync.com',
        },
      },
    },
    // backup: {
    //   enabled: true,
    //   cronSchedule: '0 0 * * *',
    //   storageService: 'aws-s3',
    //   awsAccessKeyId: env('AWS_ACCESS_KEY_ID'),
    //   awsSecretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
    //   awsRegion: 'us-east-1',
    //   awsS3Bucket: 'the-great-sync-backups',
    //   databaseDriver: 'pg', // 'pg' for PostgreSQL
    //   pgDumpExecutable: '/usr/bin/pg_dump', // Path for pg_dump
    //   pgDumpOptions: [
    //     '--no-owner',
    //     '--clean'
    //   ],
    //   allowCleanup: true,
    //   timeToKeepBackupsInSeconds: 172800, // 2 days
    //   cleanupCronSchedule: '0 1 * * *', // Every day at 1 AM
    //   errorHandler: (error, strapi) => {
    //     console.error("Database Backup Error:", error);
    //   },
    // }

});