/**
 *  chapter controller
 */

import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::chapter.chapter');

module.exports = factories.createCoreController('api::chapter.chapter', ({ strapi }) => ({

    async find(ctx) {

        console.log('-------- USER DATA ----------');
        // console.log(ctx.state)
        console.log('----------------------')

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