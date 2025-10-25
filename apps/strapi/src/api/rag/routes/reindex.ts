export default {
    routes: [
      {
        method: 'POST',
        path: '/rag/reindex',
        handler: 'rag.reindex',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  