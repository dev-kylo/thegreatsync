/**
 * A set of functions called "actions" for `purchase`
 */

import { PaddleOrder } from "../../../../custom-types";


// User will have a checkbox to use an existing account. Just has to supply an email address with orderId to look up, then must login
// otherwise, provide name, email and password, anything else? Experience Level, Background

export default {
  register: async (ctx, next) => {
    try {
      const data = ctx.request.body as { username: string, password?: string, orderId: string, existingAccount: boolean}
      // Find order
      console.log('Finding Order')
      const order = await strapi.db.query('api::order.order').findOne({
        where: { order_id: data.orderId },
        populate: ['user']
      })

      if (!order){ 
        return ctx.response.forbidden('No order exists');
      }

      // Check for an existing user
      console.log('Searching for User')
     let user =  await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { email: data.username }
      }) 


      // Check if order already has a user assigned to it
      if (order?.user) {
        // if the order user's email matches the logged in user's email, instruct to login
        if (user && order.user.email === user.email) {
          ctx.body = {
            success: true,
            message: 'Your account has already been registered with this course. Proceed to login.'
          };
          await next();
        }
        // There is a different email already attached to this order than the one supplied
        return ctx.forbidden('The account has already been registered for this order. You can proceed to login')
      }

      // If no user found despite user claiming to have an existingAccount
      if (!user && data.existingAccount) {
        return ctx.response.notFound('No user with this email address was found. Register with a different address.')
      }

      // If user found but did not delcare that an existing accounts exists (needs work)
      if (user && !data.existingAccount) {
        return ctx.response.methodNotAllowed('A user account with this address already exists. Select the option for using an existing account and try again.')
      }

      // If there is a user, update User data
      if (user && data.existingAccount){

        // User is attached to the order
        await strapi.entityService.update('api::order.order', order.id, {
          data: {
            user: user.id
          },
        });

        console.log('User Updated')
        ctx.body = {
          success: true,
          message: 'Your account has been updated with the new course. Proceed to login.'
        };

        return next()

      } else {
        // Create new User
        // Get Enrollment from Order
        // Add enrollment to payload
        console.log('Creating new user')
        user = await strapi.plugins['users-permissions'].services.user.add({
          blocked: false,
          confirmed: true, 
          username: data.username, // so username will always be unique
          email: data.username,
          password: data.password, //will be hashed automatically
          provider: 'local', //provider
          created_by: 1, //user admin id
          updated_by: 1, //user admin id
          role: 1, //role id
        });
        console.log('NEW USER CREATED'); 
        await strapi.entityService.update('api::order.order', order.id, {
          data: {
            user: user.id
          },
        });

        ctx.body = {
          success: true,
          message: 'You have successfully registered. Proceed to login.'
        };
      }

    // Create enrollment for user

    // Now with a valid user, create a course progress record for that specific course
    // await strapi.entityService.create('api::user-course-progress.user-course-progress', { data: {
    //   user: user.id,
    //   course: order.
    // }});

    } catch (err) {
      console.log('Caught')
      console.log(err)
      ctx.body = err;
    }


  },
  	createOrder: async (ctx, next) => {
      console.log('Create Order')
      try {
        // Verify Order

        // Extract values
        const data = ctx.request.body as PaddleOrder;
        const payload = (({ email,balance_fee,balance_gross,balance_tax,checkout_id,country,coupon,currency,custom_data,customer_name,earnings,fee,event_time,marketing_consent,order_id,payment_method,payment_tax,product_id,sale_gross,used_price_override,alert_name,receipt_url}) =>({ email,balance_fee,balance_gross,balance_tax,checkout_id,country,coupon,currency,custom_data,customer_name,earnings,fee,event_time,marketing_consent,order_id,payment_method,payment_tax,product_id,sale_gross,used_price_override,alert_name, receipt_url}))(data);
    
    
        
        // Create Order - No need to check for existing order, orderId must be unique anyway
        await strapi.entityService.create('api::order.order', {data: payload});

        // Send email

        // Return response
        ctx.body = {
          success: true,
          message: `You have been emailed a link to complete the registration and access the course. If you do not receive this email please contact kylo@thegreatsync.com`
        };
          
      } catch(err){
          ctx.body = err;
      }
	} 
};
