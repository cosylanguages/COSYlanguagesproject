const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./auth');
const User = require('./models/user');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost/cosylanguages_test', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

describe('Auth routes', () => {
  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser',
        password: 'password'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not sign up an existing user', async () => {
    await new User({ username: 'testuser', password: 'password' }).save();
    const res = await request(app)
      .post('/auth/signup')
      .send({
        username: 'testuser',
        password: 'password'
      });
    expect(res.statusCode).toEqual(400);
  });

  describe('with an existing user', () => {
    beforeEach(async () => {
      const salt = await require('bcryptjs').genSalt(10);
      const password = await require('bcryptjs').hash('password', salt);
      await new User({ username: 'testuser2', password }).save();
    });

    it('should log in an existing user', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser2',
          password: 'password'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should not log in a user with an invalid password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          username: 'testuser2',
          password: 'wrongpassword'
        });
      expect(res.statusCode).toEqual(400);
    });
  });

  it('should log out a user', async () => {
    const res = await request(app).post('/auth/logout');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Logged out successfully');
  });
});
