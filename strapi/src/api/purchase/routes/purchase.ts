export default {
  routes: [
    {
     method: 'GET',
     path: '/purchase',
     handler: 'purchase.newpurchase',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
