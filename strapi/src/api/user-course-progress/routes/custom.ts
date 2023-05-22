export default {
    routes: [
      {
       method: 'PUT',
       path: '/user-course-progress',
       handler: 'user-completions.updateUserCompletionData',
       config: {
         policies: [],
         middlewares: [],
       },
      },
      {
        method: 'GET',
        path: '/user-course-progress',
        handler: 'user-completions.getUserCompletionData',
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
  