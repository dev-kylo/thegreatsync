/**
 * A set of functions called "actions" for `purchase`
 */

import { PaddleOrder } from "../../../../schemas";

export default {
  register: async (ctx, next) => {
    try {

      const data = ctx.request.body as { username: string, password: string, orderId: string}

      // Find order
      console.log('Finding Order')
      const order = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { order_id: data.orderId }
      })

      if (!order) throw new Error('No order exists')

      // Check if order already has a user assigned to it

      // Check for an existing user
      console.log('Searching for User')
     let user =  await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { email: data.username }
      }) 

      // If there is, update User data
      if (user){
        await strapi.db.query('plugin::users-permissions.user').update({
          where: { id: user.id },
          data: {
            password: data.password,
          },
        });
        console.log('User Updated')

      } else {
        // Create new User
        user = await strapi.plugins['users-permissions'].services.user.add({
          blocked: false,
          confirmed: true, 
          username: data.username, // so username will always be unique
          email: data.username,
          password: 'default', //will be hashed automatically
          provider: 'local', //provider
          created_by: 1, //user admin id
          updated_by: 1, //user admin id
          role: 1 //role id
        });
        console.log('NEW USER CREATED');
      }

      ctx.body = {
        success: true,
      };

    } catch (err) {
      ctx.body = err;
    }
  },
  	createOrder: async (ctx, next) => {
      console.log('Create Order')
      try {
        // Verify Order

        // Extract values
        const data = ctx.request.body as PaddleOrder;
        const payload = (({ email,alert_id,balance_currency,balance_fee,balance_gross,balance_tax,checkout_id,country,coupon,currency,custom_data,customer_name,earnings,fee,event_time,marketing_consent,order_id,payment_method,payment_tax,product_id,product_name,sale_gross,used_price_override,alert_name}) =>({ email,alert_id,balance_currency,balance_fee,balance_gross,balance_tax,checkout_id,country,coupon,currency,custom_data,customer_name,earnings,fee,event_time,marketing_consent,order_id,payment_method,payment_tax,product_id,product_name,sale_gross,used_price_override,alert_name}))(data);
        console.log(payload)

      
        // Create Order - No need to check for existing order, orderId must be unique anyway
        const order = await strapi.entityService.create('api::order.order', {data: payload});
        console.log(order)

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
