export default {
    type: 'content-api',
    routes: [
      {
        method: 'POST',
        path: '/rag/reindex',
        handler: 'rag.reindex',
        config: {
          policies: ['admin::isAuthenticatedAdmin'], // require Admin auth
        },
      },
    ],
  };
  