/**
 *  order controller
 */

import { factories } from '@strapi/strapi'


export default factories.createCoreController('api::order.order', ({ strapi }) =>  ({
    async find(ctx) {
      const sanitizedQueryParams = await this.sanitizeQuery(ctx);
      const { results, pagination } = await super.find(sanitizedQueryParams);
      const sanitizedResults = await this.sanitizeOutput(results, ctx);
  
      return this.transformResponse(sanitizedResults, { pagination });
    }

  }));