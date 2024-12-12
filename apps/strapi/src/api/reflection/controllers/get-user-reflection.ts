
export default {
    getUserReflection: async (ctx, next) => {
        const { id: userId } = ctx.state.user;
        const courseId = ctx.params.courseId;


        // Gets all the enrolments for that user
        const reflections = await strapi.db.query('api::reflection.reflection').findMany({
            where: {  
                user: {
                    id: {
                        $eq: userId
                    }
                },
                course: {
                    id: {
                        $eq: courseId
                    }
                }
            },
            populate: ['chapter', 'chapter.menu'],
            orderBy: [{
                'chapter': {
                    'menu': {
                        'orderNumber': 'asc'
                    }
                }
            }]
            // populate: ['chapter', 'chapter.menu']
        });
        
        ctx.response.body = reflections;

        await next();
    }
}
        