const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const eventsRouter = require('./routes/events');

const app = express();
app.use(express.json());
app.use('/events', eventsRouter);

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost/cosylanguages_test', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /events/add', () => {
  it('should create a new event', async () => {
    const res = await request(app)
      .post('/events/add')
      .send({
        title: 'Test Event',
        level: 'Intermediate',
        clubType: 'The Greatest Quotes',
        description: 'A test event description.',
      });
    expect(res.statusCode).toBe(200);
  });
});

describe('GET /events', () => {
  it('should return an object with an array of events', async () => {
    const res = await request(app).get('/events');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.events)).toBe(true);
  });
});
