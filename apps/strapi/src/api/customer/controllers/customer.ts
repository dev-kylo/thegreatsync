/**
 * A set of functions called "actions" for `purchase`
 */

import {  Course, CustomerService, Order, PaddleFulfillment, User } from "../../../../custom-types";
import { getErrorString } from "../../../utils/getErrorString";
import { mapPaddleOrder } from "../../../utils/orderMappings";
// import { validateWebhook } from "../../../utils/verifyPadelWebook";

// User will have a checkbox to use an existing account. Just has to supply an email address with orderId to look up, then must login

export default {
  register: async (ctx, next) => {
    
    const data = ctx.request.body as { username: string, password?: string, orderId: string, existingAccount: boolean}
    let locatedOrderId;
    try {
      // Find order
      const order = await strapi.db.query('api::order.order').findOne({
        where: { order_id: data.orderId },
        populate: ['user']
      }) as Order;

      if (!order){ 
        return ctx.response.forbidden('This is an invalid registration url.'); 
      }

      locatedOrderId = order.id;

     let user =  await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { email: data.username }
      }) as User;

      if (user) console.log('--- USER FOUND. UPDATING ORDER ---')

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
          } as Order,
        });

        console.log('--- ORDER UPDATED ---')
          // Enroll User In Course 
        await strapi.service('api::customer.customer').createUserEnrollment(order, user.id);
        
        console.log('--- USER ENROLLED IN COURSE ---')

        ctx.body = {
          success: true,
          message: 'The account has been updated with the new course. Login below.'
        };

        return next()

      } else {
        // Create new User
        // Get Enrollment from Order
        // Add enrollment to payload
        console.log('--- USER NOT FOUND. CREATING NEW USER ---', data?.username)
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

        console.log('--- NEW USER CREATED ---', user?.id); 
        await strapi.entityService.update('api::order.order', order.id, {
          data: {
            user: user.id
          } as Order,
        });

          // Enroll User In Course 
        await strapi.service('api::customer.customer').createUserEnrollment(order, user.id);
        console.log('--- USER ENROLLED IN COURSE ---')

        ctx.body = {
          success: true,
          orderId: order.order_id,
          message: 'Successful registration. Login below.'
        };
      }

    } catch (err) {
      console.log(' --- Unsuccessful registration attempt ----', data?.orderId);
      await strapi.plugin('email').service('email').send({
        to: process.env.CONTACT_ADDRESS,
        subject: 'Error Registering Account',
        text: '',
        html: `<p>Error Registering Account: Provided Order: ${data.orderId}.</p>
          <p> Created Order Id: ${locatedOrderId || 'none'} </p>
          <p> Error: ${getErrorString(err)}</p>
          `,
        headers: {
          'X-PM-Message-Stream': 'purchases'
        }
      });
      console.log(err)
      ctx.body = err;
    }
  },
  	createOrder: async (ctx, next) => {

      const data = ctx.request.body as PaddleFulfillment;
      let trackingOrderId, courseTitle;
      try {
        // Verify Order
        // if (!validateWebhook(data, process.env.PADDLE_PUBLIC_KEY)) return ctx.forbidden('Invalid webhook signature');

        console.log('--- WEBHOOK VERIFIED ---')
        // Extract values
        const payload = mapPaddleOrder(data);
        
        // Create Order - No need to check for existing order, orderId must be unique anyway
        const order = await strapi.entityService.create('api::order.order', { data: payload }) as Order;
        trackingOrderId = order.id;
        
        courseTitle = data?.release_course_title;
        
        console.log('--- ORDER CREATED ---' + courseTitle + ' ' + trackingOrderId);
       
        // Send welcome email
        await strapi.plugin('email').service('email').send({
          to: payload.email,
          subject: `Welcome${courseTitle ? ` to ${courseTitle}` : ''}`,
          text: '',
          html: `
            <!DOCTYPE html>
              <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                      body, table, td, a { text-decoration: none; font-family: Arial, sans-serif; color: #333; }
                      body { background-color: #f4f4f4; margin: 0; padding: 0; }
                      table { border-collapse: collapse; width: 100%; }
                      .email-container { max-width: 600px; width: 100%; margin: auto; }
                      .header img { width: 100%; max-width: 600px; height: auto; }
                      .content { padding: 20px; background-color: #ffffff; }
                      .cta-button { display: inline-block; padding: 12px 20px; background-color: #031440; color: #ffffff; text-align: center; border-radius: 5px; text-decoration: none; }
                      .footer { text-align: center; font-size: 12px; color: #777; padding: 20px; }
                      
                      /* Responsive adjustments */
                      @media screen and (max-width: 600px) {
                          .content { padding: 15px; }
                          .header img { max-width: 100%; }
                      }
                  </style>
              </head>
              <body>
                  <center>
                      <table role="presentation" class="email-container">
                          <!-- Header Section with Image -->
                          <!-- Content Section -->
                          <tr>
                              <td class="content">
                                  <h1 style="color: #038578; font-size: 24px;">Your mental model is about to grow!</h1>
                                  <p>Congratulations ${courseTitle ? `on joining <em>${courseTitle}</em>.` : '!'} You are about to start an exciting journey into the realm of JavaScript and The Great Sync!</p>
                                  <p>Click the link below to register and access the course platform:</p>
                                  <p style="text-align: center;">
                                      <a href="${process.env.TGS_FE_URL}/register?orderid=${order.order_id}" class="cta-button"> Access the course </a>
                                  </p>
                                  <p>You can also bookmark the <a href="${process.env.TGS_FE_URL}">homepage link</a>.</p>
                                  <h2 style="color: #038578; font-size: 18px"> Join the Syncer Community </h2>
                                  <p> Click the link below to gain access to The Syncer Community on Discord. If the link does not work, download the Discord application first</p>
                                  <p style="text-align: center;">
                                      <a href="${process.env.DISCORD_INVITE}/register?orderid=${order.order_id}" class="cta-button"> Join The Syncers</a>
                                  </p>
                                  <p> This is where you can post your exercises and receive feedback, as well as meet and support the other Syncer students. </p>
                                  <p> Remember to introduce yourself 😉! </p>
                                  <p>Kylo</p>
                              </td>
                          </tr>

                          <!-- Footer Section -->
                          <tr>
                              <td class="footer">
                                  <p>&copy; ${new Date().getFullYear()} The Great Sync. All rights reserved.</p>
                              </td>
                          </tr>
                      </table>
                  </center>
              </body>
              </html> 
          `,
          headers: {
            'X-PM-Message-Stream': 'outbound',
          }
        });
        console.log('--- EMAIL SENT TO CUSTOMER ---', order?.order_id);
  
        // Return response
        ctx.body = {
          success: true,
          orderId: order.order_id,
          message: `You have been emailed a link to complete the registration and access the course.`
        };
          
      } catch(err){

        console.log(`--- Error Creating Order: Provider Order: ${data.p_order_id}. Created Order Id: ${trackingOrderId || 'none'}. Date: ${data.event_time} ---`)
        
        // Notify Customer of Failure
        if (data?.email){
          await strapi.plugin('email').service('email').send({
            to: data.email,
            subject: 'There is a delay processing your order',
            text: '',
            html: `<h2>Hi! 👋</h2> 
              <p>I received your order to join ${courseTitle? courseTitle : 'a Great Sync course'}, and super excited to have you on board.</p>
              <p> Unfortunately, there is a system delay in processing your order, and you might not yet have received the links to the course platform. </p>
              <p> Apologies for this!<strong>You will receive the access emails within a few hours</strong></p>
              <p> In the meantime, join The Syncer Community on Discord and introduce yourself. If the link doesn't work, download the Discord application first.</p>
              <a href='${process.env.DISCORD_INVITE}'>${process.env.DISCORD_INVITE}</a>
              <p> You will be hearing from me very soon.  Reply to this email if you need to contact me.</p>
              <p>Kylo</p>
              `,
            headers: {
              'X-PM-Message-Stream': 'outbound'
            }
          });
        }
        
        // Log Error by Email
        await strapi.plugin('email').service('email').send({
          to: process.env.CONTACT_ADDRESS,
          subject: 'Error Creating Order',
          text: '',
          html: `<h2>Error Creating Order</h2> 
            <p> Provider Order: ${data?.p_order_id}</p>
            <p> Course Title: ${courseTitle || 'none'} </p>
            <p> Created Order Id: ${trackingOrderId || 'none'} </p>
            <p> Date: ${data?.event_time}</p>
            <p> Error: ${getErrorString(err)}</p>
            <p> Webhook Data: ${data ? getErrorString(data) : 'None' }
            `,
          headers: {
            'X-PM-Message-Stream': 'outbound'
          }
        });
          // ctx.status = 403;
          ctx.body = err;
      }
	} 
};
