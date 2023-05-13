
type CompletionProgress = {
  id: number | string;
  completed: boolean;
  course?: string;
  subchapter?: string;
  chapter?: string;
}

type CustomData = {
  courseId: number | string;
  date: string;
  price: string;
}

// example
// {
//   "price": "125",
//   "courseId": 1,
//   "date": "2022-01-12"
// }


module.exports = {
    
    async afterUpdate(event) {

    const { result, params } = event;

    console.log('UPDATING ORDER')
    console.log({result, params})

    if (!result.custom_data)  return console.log('Attempted completion data failed: No custom data attached to this order');

    //The order must already have an attached user record
    if (!result.user?.id) return console.log('Attempted completion data failed: No user is linked to this order');

    const customData = result.custom_data as CustomData;
    
    //Find the course attached to the order
    const course = await strapi.db.query('api::course.course').findOne({
      where: {  id: customData.courseId },
      populate: ['chapters', 'chapters.subchapters', 'chapters.subchapters.pages']
    })

    //The order data must link to a course with existing chapters.
    if (!course || !course.chapters) return console.log('Attempted completion data failed: Either no course or no course chapters found');

    // Check for an existing user completion for that user and course
    const existing = await strapi.db.query('api::user-course-progress.user-course-progress').findOne({
      where: {  course: customData.courseId, user: result.user.id },
    })

    if (existing) return console.log('Attempted completion data failed: a user-course-progress record already exists for this user and course.');
    
    // Preparing all of the completion data to be stored as data
    const chapterCourseCompletion:CompletionProgress = course.chapters.map(crs => {
      return {id: crs.id, completed: false, course: customData.courseId}
    })
    // flatten subchapters array and add the chapter ID to each chapter
    const subchapters = course.chapters.reduce(((acc, curr) => { return acc = [...acc, ...(curr.subchapters.map(sb =>{ return {...sb, chapter: curr.id}}))]}), []);
    const subchapterCourseCompletion:CompletionProgress = subchapters.map(sub => {
      return {id: sub.id, completed: false, chapter: sub.chapter}
    })
     // flatten pages array and add the subchapter ID to each page
    const pages = subchapters.reduce(((acc, curr) => { 
      return acc = [...acc, ...(curr.pages.map(pg =>{ return {...pg, subchapter: curr.id}}))]
    }), []);
    const pageCourseCompletion:CompletionProgress = pages.map(sub => {
      return { id: sub.id, completed: false, subchapter: sub.subchapter}
    })

    try {
      // Addd course completion record for that user
      await strapi.entityService.create('api::user-course-progress.user-course-progress', { data: {
        user: result.user.id,
        course: course.id,
        chapters: JSON.stringify(chapterCourseCompletion),
        subchapters: JSON.stringify(subchapterCourseCompletion ),
        pages:  JSON.stringify(pageCourseCompletion)
      }});
      console.log(`user-course-progress record created for userID: ${result.user.id}.`)

      // Create a new enrollment for that course and user 
      await strapi.entityService.create('api::enrollment.enrollment', { data: {
        user: result.user.id,
        course: course.id,
        date: customData.date,
        price: customData.price
      }});
      console.log(`New enrollment created for user ${result.user.id}, course: ${course.id}`)
    } catch(e){
      console.log(e)
    }

    
    },
  }