const { gitService } = require('../services/git');

/**
 * @module gitController
 * @description Controller handling Git-related HTTP endpoints
 * @typedef {Object} GitController
 * @property {WebhookHandler} handleWebhook - Handles incoming Git webhook requests
 */
const gitController = {
    /**
     * Handles the Git webhook
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     * @returns {Promise<void>}
     * @throws {Error} When webhook processing fails
     */
    async handleWebhook(req, res, next) {
         /** @type {{ref: string, commits: Array<{modified: string[]}>}} */
        const payload = req.body;

        try {
            const result = await gitService.processWebhook(payload);
            res.status(200).send(result.message)
        } catch (error) {
            console.error('Webhook processing error:', error);
            error.statusCode = 500;
            error.message = 'Failed to process webhook';
            next(error); // middleware error handler will catch this
        }
    }
};
module.exports = { gitController };