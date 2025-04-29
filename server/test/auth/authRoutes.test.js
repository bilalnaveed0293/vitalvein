const request = require('supertest');
const app = require('../../server'); // Import the app from server.js

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
  });

  it('should login a user', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
