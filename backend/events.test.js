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
        start: new Date(),
        end: new Date(Date.now() + 3600000),
        description: 'Event description',
      });
    expect(res.statusCode).toBe(200);
  });
});

describe('GET /events', () => {
  it('should return an array of events', async () => {
    const res = await request(app).get('/events');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
