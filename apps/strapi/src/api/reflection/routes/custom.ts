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
    ],
  };
  