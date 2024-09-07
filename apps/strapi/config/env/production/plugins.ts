
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

});