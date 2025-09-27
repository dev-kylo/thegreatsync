
module.exports = ({ env }) => ({

    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: env('PROD_SMTP_HOST') || 'smtp.postmarkapp.com',
          port: Number(env('PROD_SMTP_PORT') || 2525), // try 2525 first
          secure: false,        
          auth: {
            user: env('SMTP_USERNAME'),
            pass: env('SMTP_PASSWORD'),
          },
          // ↓ mitigate ETIMEDOUT on droplets
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
    }

});