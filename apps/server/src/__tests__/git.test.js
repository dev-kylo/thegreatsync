const request = require('supertest');
const express = require('express');
const { gitController } = require('../controllers/git');
const { gitService } = require('../services/git');
const verifyGitOrigin = require('../middlewares/verifyGitOrigin');

// Mock the gitService
jest.mock('../services/git', () => ({
  gitService: {
    processWebhook: jest.fn(),
  }
}));



const app = express();
app.use(express.json());
app.post('/webhook', verifyGitOrigin, gitController.handleWebhook);

describe('Git Webhook Endpoint', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should process webhook successfully for valid payload', async () => {
    // Mock successful webhook processing
    // gitService.processWebhook.mockResolvedValue({ message: 'Deployment started' });
    gitService.processWebhook.mockResolvedValue({ 
      message: 'Deployment started' 
    });
    

    const mockPayload = {
      ref: 'refs/heads/main',
      commits: [
        {
          modified: ['apps/strapi/some-file.js']
        }
      ],
      repository: {
        id: 454284151
      }
    };

    await request(app)
      .post('/webhook')
      .send(mockPayload)
      .expect(200);

    expect(gitService.processWebhook).toHaveBeenCalledWith(mockPayload);
  });

  it('middleware should handle errors during webhook processing -eg no commits', async () => {
    // Mock error during webhook processing
    gitService.processWebhook.mockRejectedValue(
        new Error('Processing failed')
    );

    const mockPayload = {
      ref: 'refs/heads/main',
      commits: [],
      repository: {
        id: 454284151
      }
    };

    await request(app)
      .post('/webhook')
      .send(mockPayload)
      .expect(500);

      expect(gitService.processWebhook).toHaveBeenCalledWith(mockPayload);
  });

  it('contains invalid repository ID - is handled by middleware, does not call service', async () => {
    // Mock error during webhook processing
    gitService.processWebhook.mockRejectedValue(
        new Error('Processing failed')
      );

    const mockPayload = {
      ref: 'refs/heads/main',
      commits: [],
      repository: {
        id: 4511111
      }
    };

    await request(app)
      .post('/webhook')
      .send(mockPayload)
      .expect(403);

      expect(gitService.processWebhook).not.toHaveBeenCalledWith(mockPayload);
  });
});