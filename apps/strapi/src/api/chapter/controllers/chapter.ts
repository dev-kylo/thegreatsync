/**
 *  chapter controller
 */

import { factories } from '@strapi/strapi'

// export default factories.createCoreController('api::chapter.chapter');

module.exports = factories.createCoreController('api::chapter.chapter', ({ strapi }) => ({

    async find(ctx) {


        const { data, meta } = await super.find(ctx);

        // Get user's enrollment for this course if user is authenticated and courseId is provided
        let allowedChapterIds = null;

        // Type-safe access to query filters
        const filters = ctx.query.filters as any;

        if (ctx.state.user && filters?.courses?.id?.$eq) {
            const userId = ctx.state.user.id;
            const courseId = filters.courses.id.$eq;
            
            // Find user's enrollment for this course
            const enrollment = await strapi.db.query('api::enrollment.enrollment').findOne({
                where: {
                    users: {
                        id: {
                            $in: [userId]
                        }
                    },
                    course: {
                        id: courseId
                    }
                },
                populate: ['tier', 'tier.allowedChapters']
            });
            
            // If user has a tier, get allowed chapter IDs
            if (enrollment?.tier?.allowedChapters) {
                allowedChapterIds = enrollment.tier.allowedChapters.map(ch => ch.id);
            }
        }
        
        // Mark chapters as locked if not in allowed list
        if (allowedChapterIds !== null) {
            data.forEach(chapter => {
                chapter.attributes.isLocked = !allowedChapterIds.includes(chapter.id);
                // Don't populate subchapters for locked chapters to reduce payload
                if (chapter.attributes.isLocked && chapter.attributes.subchapters) {
                    chapter.attributes.subchapters.data = [];
                }
            });
        }

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