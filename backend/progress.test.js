const request = require('supertest');
const express = require('express');
const progressRouter = require('./progress');

const app = express();
app.use(express.json());
app.use('/progress', progressRouter);

describe('Progress routes', () => {
  it('should get user progress', async () => {
    const res = await request(app).get('/progress/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('learnedWords');
    expect(res.body).toHaveProperty('streaks');
  });

  it('should update user progress', async () => {
    const res = await request(app)
      .put('/progress/1')
      .send({
        learnedWords: ['word1', 'word2'],
        streaks: 5
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('learnedWords', ['word1', 'word2']);
    expect(res.body).toHaveProperty('streaks', 5);
  });
});
