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
        if (!courseId || !userId) {
            console.warn(`[user-completions.getUserCompletionData] --- Invalid query paramaters --- courseId: ${courseId}, userId: ${userId}`)
            return ctx.badRequest('Invalid query paramaters');
        }
        
        console.log(`[user-completions.getUserCompletionData] --- Getting user completion data for courseID: ${courseId}, userId: ${userId}`)

        const userCompletion =  await strapi.db.query('api::user-course-progress.user-course-progress').findOne({
            where: {  user: userId, course: courseId },
        }) as UserCourseProgress

        // Exit if no user completion data found
        if (!userCompletion) {
            console.warn(`[user-completions.getUserCompletionData] --- No user course progress data found for courseID: ${courseId}, userId: ${userId}`)
            return ctx.response.notFound('No user course progress data found')
        }

        ctx.body = userCompletion;
        next();
    },

    async updateUserCompletionData(ctx, next) {
        let foundUserId, foundCourseId, foundPageId;
        try {

        // Receive completed pageID and courseID
        const qry = ctx.request.query as {courseId: string; pageId: string, unMarkPage?: string};
        const { courseId, pageId, unMarkPage } = qry;

  
        if (!courseId || !pageId) {
            console.warn(`[user-completions.updateUserCompletionData] --- Invalid query paramaters --- courseId: ${courseId}, pageId: ${pageId}`)
            return ctx.badRequest('Invalid query paramaters');
        }
        // Get User's completion data for that course
        const { id: userId } = ctx.state.user;
        foundUserId = userId;
        foundCourseId = courseId;
        foundPageId = pageId;
        console.log(`[user-completions.updateUserCompletionData] --- Updating User-Course-Progress --- courseID: ${courseId}, userId: ${userId}`)

        const userCompletion =  await strapi.db.query('api::user-course-progress.user-course-progress').findOne({
            where: {  user: userId, course: courseId },
        }) as UserCourseProgress

        // Exit if no user completion data found
        if (!userCompletion || !userCompletion?.pages || !userCompletion?.chapters || !userCompletion?.subchapters){
            
            console.warn(`[user-completions.updateUserCompletionData] --- No user course progress data found for courseID: ${courseId}, userId: ${userId}`)
            return ctx.response.notFound('No user course progress data found')
        }

        console.log(`[user-completions.updateUserCompletionData] --- User course progress data found for courseID: ${courseId}, userId: ${userId}`)

        // Set page completion to true
        const pageCompletion = userCompletion.pages;
        const targetPageIndex = userCompletion.pages.findIndex((page: PageCompletion) => page.id === +pageId);
        
        const completedPage = pageCompletion[targetPageIndex];
        if (!completedPage){
            console.warn(`[user-completions.updateUserCompletionData] --- This page does not exist in completion data --- courseID: ${courseId}, userId: ${userId}, pageId: ${pageId}`)
            return ctx.response.notFound('This page does not exist in completion data')
        }

        const markIncompleted = unMarkPage && unMarkPage === 'true'
        // If page is already completed, early exit
        if (completedPage?.completed && !markIncompleted) {
            console.warn(`[user-completions.updateUserCompletionData] --- Page already completed --- courseID: ${courseId}, userId: ${userId}, pageId: ${pageId}`)
            return ctx.body = { success: true }
        }
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
            } as UserCourseProgress,
        });
        
        ctx.response.status = 202;
        ctx.body = {
            success: true
        }
        next();
      
        } catch(err){

            console.error(`[user-completions.updateUserCompletionData]--- Error updating user completion data --- courseID: ${foundCourseId}, userId: ${foundUserId}, pageId: ${foundPageId}`, err)
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

