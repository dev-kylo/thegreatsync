"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { sanitize } = require('@strapi/utils');
exports.default = {
    findByUser: async (ctx, next) => {
        const { id: userId } = ctx.state.user;
        // const enrolments = await strapi.query('enrollment').find({ 'user.id': userId });
        const enrolments = await strapi.db.query('api::enrollment.enrollment').findMany({
            where: { user: userId },
            populate: ['course']
        });
        const courses = enrolments.map(enrolment => enrolment.course);
        const unresolved = courses.map(async (course) => await sanitize.contentAPI.output(course));
        const sanitizedCourses = await Promise.all(unresolved);
        ctx.response.body = sanitizedCourses;
        await next();
    }
};
