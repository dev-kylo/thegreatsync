/**
 *  user-course-progress controller
 */


//When extending a core controller, you do not need to re-implement any sanitization as it will already be handled by the core controller you are extending. Where possible it's strongly recommended to extend the core controller instead of creating a custom controller.
import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::user-course-progress.user-course-progress');



 