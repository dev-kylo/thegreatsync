const fs = require('fs');
const path = require('path')

export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST'),
      port: env.int('DATABASE_PORT'),
      database: env('DATABASE_NAME'),
      user: env('DATABASE_USERNAME'),
      password: env('DATABASE_PASSWORD'),
      // ssl: env('DATABASE_SSL', false)
      ssl: {
        ca: fs.readFileSync(path.resolve(__dirname, "../../certificates/prod-ca-2021.crt")).toString(),
      },
    },
  },
});
