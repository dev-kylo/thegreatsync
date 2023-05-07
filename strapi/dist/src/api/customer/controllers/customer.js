"use strict";
/**
 * A set of functions called "actions" for `purchase`
 */
Object.defineProperty(exports, "__esModule", { value: true });
// User will have a checkbox to use an existing account. Just has to supply an email address with orderId to look up, then must login
// otherwise, provide name, email and password, anything else? Experience Level, Background
exports.default = {
    register: async (ctx, next) => {
        try {
            const data = ctx.request.body;
            // Find order
            console.log('Finding Order');
            const order = await strapi.db.query('api::order.order').findOne({
                where: { order_id: data.orderId }
            });
            if (!order)
                return ctx.forbidden('No order exists');
            // Check if order already has a user assigned to it
            // Check for an existing user
            console.log('Searching for User');
            let user = await strapi.db.query('plugin::users-permissions.user').findOne({
                where: { email: data.username }
            });
            // If no user found but existingAccount param supplied
            if (!user && data.existingAccount)
                return ctx.NotFound('No user with this email address was found. Register with a different address.');
            // If user found but not delcared an existing account
            if (user && !data.existingAccount)
                return ctx.MethodNotAllowed('A user account with this address already exists. Supply a new email or select option for existing account');
            // If there is, update User data
            if (user && data.existingAccount) {
                await strapi.db.query('plugin::users-permissions.user').update({
                    where: { id: user.id },
                    data: {
                        // link order to it.
                        blocked: true,
                    },
                });
                console.log('User Updated');
                return ctx.body = {
                    success: true,
                    message: 'Your account has been updated with the new course. Proceed to login.'
                };
            }
            else {
                // Create new User
                console.log('Creating new user');
                user = await strapi.plugins['users-permissions'].services.user.add({
                    blocked: false,
                    confirmed: true,
                    username: data.username,
                    email: data.username,
                    password: 'default',
                    provider: 'local',
                    created_by: 1,
                    updated_by: 1,
                    role: 1 //role id
                });
                console.log('NEW USER CREATED');
                return ctx.body = {
                    success: true,
                    message: 'You have successfully registered. Proceed to login.'
                };
            }
        }
        catch (err) {
            console.log('Caught');
            console.log(err);
            ctx.body = err;
        }
    },
    createOrder: async (ctx, next) => {
        console.log('Create Order');
        try {
            // Verify Order
            // Extract values
            const data = ctx.request.body;
            const payload = (({ email, alert_id, balance_currency, balance_fee, balance_gross, balance_tax, checkout_id, country, coupon, currency, custom_data, customer_name, earnings, fee, event_time, marketing_consent, order_id, payment_method, payment_tax, product_id, product_name, sale_gross, used_price_override, alert_name }) => ({ email, alert_id, balance_currency, balance_fee, balance_gross, balance_tax, checkout_id, country, coupon, currency, custom_data, customer_name, earnings, fee, event_time, marketing_consent, order_id, payment_method, payment_tax, product_id, product_name, sale_gross, used_price_override, alert_name }))(data);
            console.log(payload);
            // Create Order - No need to check for existing order, orderId must be unique anyway
            const order = await strapi.entityService.create('api::order.order', { data: payload });
            console.log(order);
            // Send email
            // Return response
            ctx.body = {
                success: true,
                message: `You have been emailed a link to complete the registration and access the course. If you do not receive this email please contact kylo@thegreatsync.com`
            };
        }
        catch (err) {
            ctx.body = err;
        }
    }
};
