const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const postsRouter = require('./routes/posts');
const User = require('./models/user');

const app = express();
app.use(express.json());
app.use('/posts', postsRouter);

let testUser;

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost/cosylanguages_test', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  testUser = await new User({ username: 'testuser', password: 'password' }).save();
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

describe('POST /posts/add', () => {
  it('should create a new post with a video', async () => {
    const res = await request(app)
      .post('/posts/add')
      .field('author', testUser._id.toString())
      .field('caption', 'Test post with video')
      .attach('video', '/app/dummy.txt');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
  });
});

describe('GET /posts', () => {
  it('should return an array of posts', async () => {
    const res = await request(app).get('/posts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
