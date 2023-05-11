"use strict";
/**
 *  chapter controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const strapi_1 = require("@strapi/strapi");
// export default factories.createCoreController('api::chapter.chapter');
module.exports = strapi_1.factories.createCoreController('api::chapter.chapter', ({ strapi }) => ({
    async find(ctx) {
        console.log('-------- USER DATA ----------');
        // console.log(ctx.state)
        // some logic here
        const { data, meta } = await super.find(ctx);
        // some more logic
        // const completedPages = await strapi.entityService.findMany('api::enrollment.enrollment', {
        //     fields: ['id', 'description'],
        //     filters: { title: 'Hello World' },
        //     sort: { createdAt: 'DESC' },
        //     populate: { category: true },
        //   });
        const completedPages = await strapi.entityService.findMany('api::enrollment.enrollment', {
            fields: ['id'],
            sort: { createdAt: 'DESC' },
        });
        data.enrollments = [];
        const resp = {
            data,
            completed: completedPages.map(page => page.id)
        };
        return { data: resp, meta };
    }
}));
