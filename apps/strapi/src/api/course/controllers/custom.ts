const { sanitize } = require('@strapi/utils');

export default {
    coursesByUser: async (ctx, next) => {
        const { id: userId } = ctx.state.user;

        // Gets all the enrolments for that user
        const enrolments = await strapi.db.query('api::enrollment.enrollment').findMany({
            where: {  
                users: {
                    id: {
                        $in: [userId]
                    }
                }
            },
            populate: ['course', 'users']
        });
        
        if (!enrolments || enrolments?.length < 1) ctx.forbidden('The user is not enrolled in any courses.');
        else {
             // returns the course linked to each enrolment
            const courses = enrolments.map(enrolment => enrolment.course);
            const unresolved = courses.map(async (course) => await sanitize.contentAPI.output(course));
            const sanitizedCourses = await Promise.all(unresolved);
            ctx.response.body = sanitizedCourses;
        }

        await next();
    }
}
        