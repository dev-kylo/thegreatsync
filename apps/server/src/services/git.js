const { exec } = require('child_process');

/**
 * Service for handling Git-related operations and webhook processing
 * @typedef {Object} GitService
 * @property {function(Object): Promise<Object>} processWebhook - Processes GitHub webhook payload and triggers deployment
 * @property {function(Object): boolean} isStrapiChange - Checks if commits modified Strapi files
 * @type {GitService}
 */
const gitService = {
    /**
     * Processes a GitHub webhook payload and triggers deployment if conditions are met
     * @param {Object} payload - The webhook payload from GitHub
     * @param {string} payload.ref - The Git reference (e.g., 'refs/heads/main')
     * @param {Array} payload.commits - Array of commit objects
     * @returns {Promise<Object>} Message indicating deployment status
     * @throws {Error} If deployment fails
     */
    async processWebhook(payload) {
        if (payload.ref === 'refs/heads/main' && this.isStrapiChange(payload)) {
            try {
                exec('cd ~/thegreatsync && git pull && pnpm install && pnpm strapi build', (err, stdout, stderr) => {
                    if (err) {
                        console.error(`Error updating repo: ${stderr}`);
                        return
                    }
                    
                    // Restart Strapi using PM2
                    exec('pm2 restart ecosystem.config.js --only strapi', (err, stdout, stderr) => {
                        if (err) {
                        console.error(`Error restarting Strapi: ${stderr}`);
                        return
                        }
                        console.log(`Strapi restarted successfully: ${stdout}`);   
                    });
                });
                return { message: 'Deployment started' };
            } catch (error) {
                console.error('Deployment error:', error);
                throw error;
            }
        }
        return { message: 'No action taken - not main branch or not a strapi change' };
    },

    /**
     * Checks if any commits in the payload modified files in the Strapi directory
     * @param {Object} payload - The webhook payload from GitHub
     * @param {Array} payload.commits - Array of commit objects
     * @returns {boolean} True if Strapi-related files were modified
     */
    isStrapiChange(payload) {
        if (!payload || !Array.isArray(payload?.commits)) return false;
        return payload.commits.some(commit => 
            Array.isArray(commit.modified) && 
            commit.modified.some(file => file.includes('apps/strapi'))
        );
    },


};

module.exports = { gitService };