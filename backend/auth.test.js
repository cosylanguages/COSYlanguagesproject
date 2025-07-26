const request = require('supertest');
const express = require('express');
const authRouter = require('./auth');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth routes', () => {
  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser',
        password: 'password'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
  });

  it('should not sign up an existing user', async () => {
    await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser',
        password: 'password'
      });
    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser',
        password: 'password'
      });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('success', false);
  });

  it('should log in an existing user', async () => {
    await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser2',
        password: 'password'
      });
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser2',
        password: 'password'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
  });

  it('should not log in a user with an invalid password', async () => {
    await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser3',
        password: 'password'
      });
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'testuser3',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('success', false);
  });

  it('should log out a user', async () => {
    const res = await request(app).post('/auth/logout');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
  });
});
