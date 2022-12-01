export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '7d3f8c83a03b573a57c6372e1cbee852'),
  },
});
