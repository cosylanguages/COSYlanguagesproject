const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const postsRouter = require('./routes/posts');
const User = require('./models/user');

const app = express();
app.use(express.json());
app.use('/posts', postsRouter);

let testUser;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  testUser = await new User({ username: 'testuser', password: 'password' }).save();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

describe('POST /posts/add', () => {
  it('should create a new post with a video', async () => {
    const res = await request(app)
      .post('/posts/add')
      .field('author', testUser._id.toString())
      .field('caption', 'Test post with video')
      .attach('video', __dirname + '/../dummy.txt');
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
