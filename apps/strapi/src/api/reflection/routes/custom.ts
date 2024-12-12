export default {
    routes: [
      {
       method: 'POST',
       path: '/reflection/create',
       handler: 'create-reflection.createNewReflection',
       config: {
         policies: [],
         middlewares: [],
       },
      },
      {
        method: 'GET',
        path: '/reflectionsByUser/:courseId',
        handler: 'get-user-reflection.getUserReflection',
        config: {
          policies: [],
          middlewares: [],
        },
       },
    ],
  };
  