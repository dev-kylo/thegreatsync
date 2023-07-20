/**
 * A set of functions called "actions" for `purchase`
 */

import {  CustomPaddleData, CustomerService, Order, PaddleFulfillment, User } from "../../../../custom-types";
import { mapPaddleOrder } from "../../../utils/orderMappings";


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
      }) as Order;

      if (!order){ 
        return ctx.response.forbidden('This is an invalid registration url. Please contact Kylo.');
      }

      // Check for an existing user
      console.log('Searching for User')
     let user =  await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { email: data.username }
      }) as User;


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
          // Enroll User In Course 
        await strapi.service<CustomerService>('api::customer.customer').createUserEnrollment(order, user.id);

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

          // Enroll User In Course 
        await strapi.service<CustomerService>('api::customer.customer').createUserEnrollment(order, user.id);
  

        ctx.body = {
          success: true,
          orderId: order.order_id,
          message: 'You have successfully registered. Proceed to login.'
        };
      }

    } catch (err) {
      console.log('Caught')
      console.log(err)
      ctx.body = err;
    }
  },
  	createOrder: async (ctx, next) => {
      console.log('Create Order');
      const data = ctx.request.body as PaddleFulfillment;
      let trackingOrderId;
      try {
        // Verify Order

        // Extract values
        const payload = mapPaddleOrder(data);
        console.log(payload)
        
        // Create Order - No need to check for existing order, orderId must be unique anyway
        const order = await strapi.entityService.create('api::order.order', {data: payload}) as Order;
        trackingOrderId = order.id;
        // Send email
        const d = await strapi.plugin('email').service('email').send({
          to: payload.email,
          subject: 'Congratulations on joining The Syncer Program.',
          text: 'Click on the link below to register your new account',
          html: `<a href='${process.env.TGS_FE_URL}/register?orderId=${order.order_id}'>${process.env.TGS_FE_URL}/register?orderId=${order.order_id}</a>`,
          headers: {
            'X-PM-Message-Stream': 'purchases'
          }
        });

        console.log('EMAIL SENT')

        // Return response
        ctx.body = {
          success: true,
          orderId: order.order_id,
          message: `You have been emailed a link to complete the registration and access the course. If you do not receive this email please contact Kylo.`
        };
          
      } catch(err){
          console.log(`Subject: Error Creating Order: Provider Order: ${data.p_order_id}. Created Order Id: ${trackingOrderId || 'none'}. Date: ${data.event_time}`)
          ctx.body = err;
      }
	} 
};
