import { Page, UserCourseProgress } from "../../../../custom-types";
import { createChapterCompletion, createPageCompletion, createSubchapterCompletion } from "../../../utils/user-course-completion";


module.exports = {
  async updateAll(ctx) {

      const qry = ctx.request.query as {courseId: string};
      const { courseId } = qry;
      console.log('Updating all user completion records for courseID: '+ courseId)

    // Fetch the course and associated pages, subchapters, and chapters
    const course= await strapi.db.query('api::course.course').findOne({
        where: { id: courseId },
        populate: ['chapters', 'chapters.subchapters', 'chapters.subchapters.pages']
    })

    if (!course) return ctx.response.notFound('Course not found')

    console.log(course)
    
    // Retrieve the UserCourseProgress records for the users enrolled in the course
    const userCourseProgresses = await strapi.db.query('api::user-course-progress.user-course-progress').findMany({ 
        where: {  course: courseId },
        populate: ['user']
    }) as UserCourseProgress[]

    if (!userCourseProgresses || userCourseProgresses.length < 1) return ctx.response.notFound('No user-course-progress records found for this course')
    
    try {
        // Update UserCourseProgress records based on course structure comparison
        userCourseProgresses.forEach(async (userCourseProgress) => {
            // Update completion records for chapters
            course.chapters.forEach(chapter => {
                const chapterExistsInCompletion = userCourseProgress.chapters.find(completion => completion.id === chapter.id);
                // If chapter is not in completion data
                if (!chapterExistsInCompletion) userCourseProgress.chapters.push(createChapterCompletion(chapter.id, +courseId))

                // Subchapters
                chapter.subchapters.forEach(sub =>{
                    const subChapterExistsInCompletion = userCourseProgress.subchapters.find(completion => completion.id === sub.id);
                    // If subchapter is not in completion data
                    if (!subChapterExistsInCompletion) userCourseProgress.subchapters.push(createSubchapterCompletion(sub.id, chapter.id))

                    // Pages
                    sub.pages.forEach(pg => {
                        const pageExistsInCompletion = userCourseProgress.pages.find(completion => completion.id === pg.id);
                        if (!pageExistsInCompletion) userCourseProgress.pages.push(createPageCompletion(pg.id, sub.id))
                    })
                })
            });

            await strapi.db.query('api::user-course-progress.user-course-progress').update({
                where: {course: courseId, user: userCourseProgress.user},
                data: userCourseProgress
            })
        });

    } catch(err){
        ctx.body = err;
    }


    // Remove any deleted 

    // Return a response indicating the update was successful
    ctx.send({ message: 'UserCourseProgress records updated successfully' });
  },
};
