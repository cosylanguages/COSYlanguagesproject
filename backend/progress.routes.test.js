const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const progressRouter = require('./routes/progress');

const app = express();
app.use(express.json());
app.use('/progress', progressRouter);

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

describe('GET /progress/:courseId/:studentId', () => {
  it('should return progress for a student in a course (peut être null)', async () => {
    const courseId = new mongoose.Types.ObjectId();
    const studentId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/progress/${courseId}/${studentId}`);
    expect(res.statusCode).toBe(200);
  });
});

describe('POST /progress/update', () => {
  it('should update progress for a student in a course', async () => {
    const res = await request(app)
      .post('/progress/update')
      .send({
        courseId: new mongoose.Types.ObjectId(),
        studentId: new mongoose.Types.ObjectId(),
        lessonId: new mongoose.Types.ObjectId(),
        score: 10
      });
    expect(res.statusCode).toBe(200);
  });
});
