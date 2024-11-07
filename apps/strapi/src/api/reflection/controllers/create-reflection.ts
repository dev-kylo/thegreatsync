import { PageCompletion, UserCourseProgress } from "../../../../custom-types";
import { getErrorString } from "../../../utils/getErrorString";


// Create a function with generic type, and params for arrays

export default {

    async createNewReflection(ctx, next) {

        console.log('Create Reflection')
        // Receive pageID and courseID
        const payload = ctx.request.body as {course: string; chapter: string, subchapter?: string, user: string};

        // Exit if these are not here
        if (!payload.chapter && !payload.subchapter) return ctx.badRequest('Invalid request');

        // Get User
        const { id: userId } = ctx.state.user;

        payload.user = userId;

        console.log(payload)

        try {
            await strapi.entityService.create('api::reflection.reflection', { data: payload });
            console.log(`Successful reflection creation, userId: ${userId}`);
            ctx.response.status = 202;
        } catch(e){
            ctx.response.status = 400;
            ctx.body = e
        }

        next()

    }
    

}

