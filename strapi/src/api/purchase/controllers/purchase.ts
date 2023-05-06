/**
 * A set of functions called "actions" for `purchase`
 */

export default {
  startRegistration: async (ctx, next) => {
    try {
      const data = ctx.request.body as { email: string, purchaseId: string}

      // CHECK FOR EXISTING PURCHASE RECORDS

      // CREATE NEW USER
      const user = await strapi.plugins['users-permissions'].services.user.add({
        blocked: true,
        confirmed: false, 
        username: '',
        email: data.email,
        password: 'default', //will be hashed automatically
        provider: 'local', //provider
        created_by: 1, //user admin id
        updated_by: 1, //user admin id
        role: 1 //role id
    });

    console.log('NEW USER CREATED');
    console.log(user);

    // CREATE NEW USER ENROLMMENT WITH USER ID AND RELEASE ID RECEIVED
    // await strapi.services. ({

    // });

    // CREATE PURCHASE RECORD WITH USERID
    

      ctx.body = {
        success: true,
        message: `You have been emailed a link to complete the registration and access the course. If you do not receive this email please contact kylo@thegreatsync.com, providing this userId: ${user.id}`
      };
    } catch (err) {
      ctx.body = err;
    }
  },

};
