/**
 *  chapter controller
 */

import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::chapter.chapter');

module.exports = factories.createCoreController('api::chapter.chapter', ({ strapi }) => ({

    async find(ctx) {


        const { data, meta } = await super.find(ctx);

        const completedPages = await strapi.entityService.findMany('api::enrollment.enrollment', {
            fields: ['id'],
            sort: { createdAt: 'desc' },
        });

        data.enrollments = [];
        const resp = {
            data,
            completed: completedPages.map(page => page.id)
        };

        return { data: resp, meta };
    }

}));