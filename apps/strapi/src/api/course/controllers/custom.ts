
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
            populate: ['course', 'users', 'tier', 'tier.allowedChapters']
        });
        
        if (!enrolments || enrolments?.length < 1) ctx.forbidden('The user is not enrolled in any courses.');
        else {
             // returns the course linked to each enrolment with tier info
            const coursesWithTier = enrolments.map(enrolment => {
                const course = enrolment.course;
                // Add enrollment tier info to course object
                if (course) {
                    course.enrollmentTier = enrolment.tier;
                    course.enrollmentId = enrolment.id;
                }
                return course;
            });
            // const unresolved = courses.map(async (course) => await sanitize.contentAPI.output(course));
            // const sanitizedCourses = await Promise.all(unresolved);
            ctx.response.body = coursesWithTier;
        }

        await next();
    }
}
        