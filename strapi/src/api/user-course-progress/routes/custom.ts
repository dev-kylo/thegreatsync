export default {
    routes: [
      {
       method: 'PUT',
       path: '/user-course-progress',
       handler: 'custom.updateUserCompletionData',
       config: {
         policies: [],
         middlewares: [],
       },
      },
      {
        method: 'PUT',
        path: '/user-course-progress/synchronise',
        handler: 'synchronise.updateAll',
        config: {
          policies: [],
          middlewares: [],
        },
       },
    ],
  };
  