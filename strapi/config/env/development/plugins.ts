
module.exports = ({ env }) => ({

    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: env('SMTP_HOST'),
          port: env('SMTP_PORT', 587),
          auth: {
            user: env('SMTP_USERNAME'),
            pass: env('SMTP_PASSWORD'),
          },
        },
        settings: {
          defaultFrom: 'kylo@thegreatsync.com',
          defaultReplyTo: 'kylo@thegreatsync.com',
        },
      },
    },

});