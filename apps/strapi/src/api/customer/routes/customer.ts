export default {
  routes: [
    {
     method: 'POST',
     path: '/customer/createOrder',
     handler: 'customer.createOrder',
     config: {
       policies: [],
       middlewares: [],
     },
    },
    {
      method: 'POST',
      path: '/customer/register',
      handler: 'customer.register',
      config: {
        policies: [],
        middlewares: [],
      },
     },
    {
      method: 'GET',
      path: '/customer/check-email',
      handler: 'customer.checkEmail',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/customer/register-authenticated',
      handler: 'customer.registerAuthenticated',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
