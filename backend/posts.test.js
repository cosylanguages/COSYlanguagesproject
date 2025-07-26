const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const postsRouter = require('./routes/posts');

const app = express();
app.use(express.json());
app.use('/posts', postsRouter);

// Connexion à une base de test MongoDB (en mémoire ou locale)
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost/cosylanguages_test', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /posts/add', () => {
  it('should create a new post (sans vidéo)', async () => {
    const res = await request(app)
      .post('/posts/add')
      .field('author', new mongoose.Types.ObjectId())
      .field('caption', 'Test post');
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
