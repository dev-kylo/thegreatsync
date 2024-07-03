import { factories } from '@strapi/strapi'; 
import type { CustomPaddleData, ChapterCompletion, PageCompletion, SubchapterCompletion, CustomerService, Course, User, Order } from '../../../../custom-types'
import { createSubchapterCompletion } from '../../../utils/user-course-completion';



export default factories.createCoreService<CustomerService>('api::customer.customer', ({ strapi }) =>  ({


    async createUserEnrollment(order: Order, userId: string|number) {

    
        if (!order || !order?.release_enrolment_id) throw new Error('Attempted completion data failed: No custom data attached to this order');

        //The order must already have an attached user record
        if (!userId) throw new Error('Attempted completion data failed: No user is linked to this order');

        const enrolmentId = order.release_enrolment_id;

        console.log(enrolmentId)

        // Get the current enrollment

        
        const enrolment = await strapi.db.query('api::enrollment.enrollment').findOne({
            where: {  id: +enrolmentId },
            populate: ['users']
        });
        
        if (enrolment) {
            console.log('---- Enrolment found ----');
            // Append the userId to the users array
            enrolment.users.push(userId);

            // Attach user to the given enrolment's users
            await strapi.entityService.update('api::enrollment.enrollment', +enrolmentId, { data: {
                users: enrolment.users
            }});

            console.log('---- Enrolment updated ----');

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

        if (existing) throw new Error('Attempted completion data failed: a user-course-progress record already exists for this user and course.');
        
        console.log('--- Service: Preparing User Completion ----')

        // Preparing all of the completion data to be stored as data
        const chapterCourseCompletion:ChapterCompletion[] = course.chapters.map(crs => {
            return {id: crs.id, completed: false, course: +order.release_course_id}
        }) 
        // flatten subchapters array and add the chapter ID to each chapter
        const subchapters = course.chapters.reduce(((acc, curr) => { return acc = [...acc, ...(curr.subchapters.map(sb =>{ return {...sb, chapter: curr.id}}))]}), []);
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
            chapters: JSON.stringify(chapterCourseCompletion),
            subchapters: JSON.stringify(subchapterCourseCompletion ),
            pages:  JSON.stringify(pageCourseCompletion)
        }});

        console.log(`--- User Completion Stats Successful, userID: ${userId} ---`)

      
    },


}));