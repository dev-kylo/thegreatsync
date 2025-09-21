import { Page, UserCourseProgress } from "../../../../custom-types";
import { createChapterCompletion, createPageCompletion, createSubchapterCompletion } from "../../../utils/user-course-completion";


module.exports = {
  async updateAll(ctx) {

      const qry = ctx.request.query as {courseId: string};
      const { courseId } = qry;
      console.log(`[synchronise.updateAll] --- Updating all user completion records for courseID: ${courseId}`)

    // Fetch the course and associated pages, subchapters, and chapters
    const course= await strapi.db.query('api::course.course').findOne({
        where: { id: courseId },
        populate: ['chapters', 'chapters.subchapters', 'chapters.subchapters.pages']
    });

    console.warn(`[synchronise.updateAll] --- Course not found for courseID: ${courseId}`)

    if (!course) return ctx.response.notFound('Course not found')
    
    // Retrieve the UserCourseProgress records for the users enrolled in the course
    const userCourseProgresses = await strapi.db.query('api::user-course-progress.user-course-progress').findMany({ 
        where: {  course: courseId },
        populate: ['user']
    }) as UserCourseProgress[]

    if (!userCourseProgresses || userCourseProgresses.length < 1) return ctx.response.notFound('No user-course-progress records found for this course')
    
    try {

        const validPageIds: number[] = [];
        const validSubchapterIds: number[] = [];
        const validChapterIds: number[] = [];

        // Update UserCourseProgress records based on course structure comparison
        userCourseProgresses.forEach(async (userCourseProgress) => {
            
            // Chapters
            course.chapters.forEach(chapter => {
                validChapterIds.push(chapter.id)
                const chapterExistsInCompletion = userCourseProgress.chapters.find(completion => completion.id === chapter.id);
                // If chapter is not in completion data
                if (!chapterExistsInCompletion) userCourseProgress.chapters.push(createChapterCompletion(chapter.id, +courseId))

                // Subchapters
                chapter.subchapters.forEach((sub) =>{
                    validSubchapterIds.push(sub.id)
                    const subChapterExistsInCompletion = userCourseProgress.subchapters.find(completion => completion.id === sub.id);
                    // If subchapter is not in completion data
                    if (!subChapterExistsInCompletion) {
                        userCourseProgress.subchapters.push(createSubchapterCompletion(sub.id, chapter.id))
                         // If there is an existing chapter, it can no longer be completed
                        if (chapterExistsInCompletion) chapterExistsInCompletion.completed = false;
                    }

                    // Pages
                    sub.pages.forEach(pg => {
                        validPageIds.push(pg.id)
                        const pageExistsInCompletion = userCourseProgress.pages.find(completion => completion.id === pg.id);
                        if (!pageExistsInCompletion){
                            userCourseProgress.pages.push(createPageCompletion(pg.id, sub.id))
                            // If there is an existing subchapter, that subchapter and its parent chapter can longer be completed
                            if (subChapterExistsInCompletion){
                                subChapterExistsInCompletion.completed = false;
                                chapterExistsInCompletion.completed = false;
                            }
                        }
                    })
                })
            });

            // Check that no pages, subpages or chapters have been deleted
            userCourseProgress.pages = userCourseProgress.pages.filter(page => !!(validPageIds.includes(page.id)))
            userCourseProgress.subchapters = userCourseProgress.subchapters.filter(sub => !!(validSubchapterIds.includes(sub.id)))
            userCourseProgress.chapters = userCourseProgress.chapters.filter(chap => !!(validChapterIds.includes(chap.id)))

            await strapi.db.query('api::user-course-progress.user-course-progress').update({
                where: {course: courseId, user: userCourseProgress.user},
                data: userCourseProgress
            })
        });
        console.log(`[synchronise.updateAll] --- UserCourseProgress records updated successfully for courseID: ${courseId}`)

    } catch(err){
        console.error(`[synchronise.updateAll]--- Error updating all user completion records for courseID: ${courseId}`, err)
        ctx.body = err;
    }

    // Return a response indicating the update was successful
    ctx.send({ success: true, message: 'UserCourseProgress records updated successfully' });
  },
};
