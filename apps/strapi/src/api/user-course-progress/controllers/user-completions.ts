import { PageCompletion, UserCourseProgress } from "../../../../custom-types";
import { getErrorString } from "../../../utils/getErrorString";


// Create a function with generic type, and params for arrays

export default {

    async getUserCompletionData(ctx, next){
        // Receive completed pageID and courseID
        const qry = ctx.request.query as {courseId: string;};
        const {courseId } = qry;
        // Get User's completion data for that course
        const { id: userId } = ctx.state.user;
        // Exit if these are not here
        if (!courseId || !userId) return ctx.badRequest('Invalid query paramaters');
        
        const userCompletion =  await strapi.db.query('api::user-course-progress.user-course-progress').findOne({
            where: {  user: userId, course: courseId },
        }) as UserCourseProgress

        // Exit if no user completion data found
        if (!userCompletion) return ctx.response.notFound('No user course progress data found')

        ctx.body = userCompletion;
        next();
    },

    async updateUserCompletionData(ctx, next) {
        let foundUserId;
        try {

        console.log('Updating User-Course-Progress')
        // Receive completed pageID and courseID
        const qry = ctx.request.query as {courseId: string; pageId: string, unMarkPage?: string};
        const { courseId, pageId, unMarkPage } = qry;

        // Exit if these are not here
        if (!courseId || !pageId) return ctx.badRequest('Invalid query paramaters');

        // Get User's completion data for that course
        const { id: userId } = ctx.state.user;
        foundUserId = userId;
        const userCompletion =  await strapi.db.query('api::user-course-progress.user-course-progress').findOne({
            where: {  user: userId, course: courseId },
        }) as UserCourseProgress

        // Exit if no user completion data found
        if (!userCompletion || !userCompletion?.pages || !userCompletion?.chapters || !userCompletion?.subchapters){
            return ctx.response.notFound('No user course progress data found')
        }

        // Set page completion to true
        const pageCompletion = userCompletion.pages;
        const targetPageIndex = userCompletion.pages.findIndex((page: PageCompletion) => page.id === +pageId);
        
        const completedPage = pageCompletion[targetPageIndex];
        if (!completedPage) return ctx.response.notFound('This page does not exist in completion data')

        const markIncompleted = unMarkPage && unMarkPage === 'true'
        // If page is already completed, early exit
        if (completedPage?.completed && !markIncompleted) return ctx.body = { success: true }
        completedPage.completed = !markIncompleted 
        
        // For each subchapter
        userCompletion.subchapters.forEach(sb => {
            // filter all pages for that subchaper
            const all = pageCompletion.filter(pg => +pg.subchapter === sb.id);
            const completed = all.filter(page => page.completed);
            // if all pages of subchapter are complete set subchapter to TRUE
            if (all.length === completed.length) sb.completed = true;
            else sb.completed = false;
        })

        // For each chapter
        userCompletion.chapters.forEach(chp => {
            // filter all subpages for that chaper
            const all =  userCompletion.subchapters.filter(sb => +sb.chapter === chp.id);
            const completed = all.filter(sub => sub.completed);
            // if all pages of subchapter are complete set subchapter to TRUE
            if (all.length === completed.length) chp.completed = true;
            else chp.completed = false;
        })

        // Update 
        await strapi.entityService.update('api::user-course-progress.user-course-progress', userCompletion.id, {
            data: {
                pages: userCompletion.pages,
                subchapters: userCompletion.subchapters,
                chapters: userCompletion.chapters
            },
        });
        
        ctx.response.status = 202;
        ctx.body = {
            success: true
        }
        next();
      
        } catch(err){
            await strapi.plugin('email').service('email').send({
                to: process.env.CONTACT_ADDRESS,
                subject: 'Error Updating Course Progress',
                text: '',
                html: `
                  <p> UserId: ${foundUserId || 'none'} </p>  
                  <p> Error: ${getErrorString(err)}</p>
                  `,
                headers: {
                  'X-PM-Message-Stream': 'purchases'
                }
              });
            ctx.body = err;
        }
        // return response;
      }
}

