module.exports = {
    /**
     * Promise to fetch authenticated user.
     * @return {Promise}
     */
    fetchAuthenticatedUser(id) {
        console.log('Custom fetch user');
        return strapi.entityService
            .query('plugin::users-permissions.user')
            .findOne({ where: { id }, populate: ['role', 'enrollments'] });
    },
};
