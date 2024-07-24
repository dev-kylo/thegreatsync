module.exports = {
  /**
   * Promise to fetch authenticated user.
   * @return {Promise}
   */
  fetchAuthenticatedUser(id) {
    console.log('Custom fetch user')
    return strapi.entityService.findOne('plugin::users-permissions.user', id, {
      populate: ['role', 'enrollments']
    });
  },
};