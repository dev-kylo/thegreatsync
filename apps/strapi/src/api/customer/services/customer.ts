import { factories } from '@strapi/strapi'; 
import type { CustomPaddleData, ChapterCompletion, PageCompletion, SubchapterCompletion, CustomerService, Course, User, Order, Enrollment } from '../../../../custom-types'
import { createSubchapterCompletion } from '../../../utils/user-course-completion';



export default factories.createCoreService('api::customer.customer', ({ strapi }) =>  ({


    async createUserEnrollment(order: Order, userId: string|number) {

    
        if (!order || !order?.release_enrolment_id) {
            console.error(`[customer.createUserEnrollment]--- Attempted completion data failed: No custom data attached to this order --- order: ${order}`)
            throw new Error('Attempted completion data failed: No custom data attached to this order');
        };

        //The order must already have an attached user record
        if (!userId) {
            console.error(`[customer.createUserEnrollment]--- Attempted completion data failed: No user is linked to this order --- order: ${order}`)
            throw new Error('Attempted completion data failed: No user is linked to this order');
        }

        const enrolmentId = order.release_enrolment_id;

        const enrolment = await strapi.db.query('api::enrollment.enrollment').findOne({
            where: {  id: +enrolmentId },
            populate: ['users', 'tier', 'tier.allowedChapters']
        });
        
        if (enrolment) {
            console.log(`[customer.createUserEnrollment]--- Enrolment found ---- enrolmentId: ${enrolmentId}`)
            // Append the userId to the users array
            enrolment.users.push(userId);

            // Attach user to the given enrolment's users
            await strapi.entityService.update('api::enrollment.enrollment', +enrolmentId, { 
                data: {
                    users: enrolment.users
                } as Enrollment
            });
            console.log(`[customer.createUserEnrollment]--- Enrolment updated ---- enrolmentId: ${enrolmentId}, userId: ${userId}`)

        }   

        //Find the course attached to the order
        const course= await strapi.db.query('api::course.course').findOne({
            where: {  id: order.release_course_id },
            populate: ['chapters', 'chapters.subchapters', 'chapters.subchapters.pages']
        }) as Course;

        //The order data must link to a course with existing chapters.
        if (!course || !course.chapters) throw new Error('Attempted completion data failed: Either no course or no course chapters found');

        // Check for an existing user completion for that user and course
        const existing = await strapi.db.query('api::user-course-progress.user-course-progress').findOne({
            where: {  course: order.release_course_id, user: userId },
        }) as User;

        if (existing) {
            console.error(`[customer.createUserEnrollment]--- Attempted completion data failed: a user-course-progress record already exists for this user and course. --- order: ${order}`)
            throw new Error('Attempted completion data failed: a user-course-progress record already exists for this user and course.');
        }
        
        console.log('--- Service: Preparing User Completion ----')

        // Get allowed chapter IDs from tier (if tier exists)
        let allowedChapterIds = null;
        if (enrolment?.tier?.allowedChapters) {
            allowedChapterIds = enrolment.tier.allowedChapters.map(ch => ch.id);
        }

        // Filter chapters based on tier (if tier exists, otherwise include all)
        const chaptersToInclude = allowedChapterIds 
            ? course.chapters.filter(ch => allowedChapterIds.includes(ch.id))
            : course.chapters;

        // Preparing all of the completion data to be stored as data
        const chapterCourseCompletion:ChapterCompletion[] = chaptersToInclude.map(crs => {
            return {id: crs.id, completed: false, course: +order.release_course_id}
        }) 
        // flatten subchapters array and add the chapter ID to each chapter (only for allowed chapters)
        const subchapters = chaptersToInclude.reduce(((acc, curr) => { return acc = [...acc, ...(curr.subchapters.map(sb =>{ return {...sb, chapter: curr.id}}))]}), []);
        const subchapterCourseCompletion:SubchapterCompletion[] = subchapters.map(sub => createSubchapterCompletion(sub.id, sub.chapter))
        // flatten pages array and add the subchapter ID to each page
        const pages = subchapters.reduce(((acc, curr) => { 
            return acc = [...acc, ...(curr.pages.map(pg =>{ return {...pg, subchapter: curr.id}}))]
        }), []);
        const pageCourseCompletion:PageCompletion[] = pages.map(sub => {
            return { id: sub.id, completed: false, subchapter: sub.subchapter}
        })

        await strapi.entityService.create('api::user-course-progress.user-course-progress', { data: {
            user: userId,
            course: course.id,
            chapters: chapterCourseCompletion,
            subchapters: subchapterCourseCompletion,
            pages: pageCourseCompletion
        }});

        console.log(`[customer.createUserEnrollment]--- User Completion Stats Successful, userID: ${userId} ---`)

    },


}));