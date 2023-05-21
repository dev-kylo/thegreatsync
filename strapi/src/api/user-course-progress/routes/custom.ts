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
    ],
  };
  