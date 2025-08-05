const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const studySetsRouter = require('./studySets');
const User = require('./models/user');
const StudySet = require('./models/studySet');

const app = express();
app.use(express.json());

// This is a mock authentication middleware.
const auth = async (req, res, next) => {
  const user = await User.findOne();
  req.user = user;
  next();
};
app.use(auth);
app.use('/study-sets', studySetsRouter);

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

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});

describe('Study Sets routes', () => {
  let user;
  beforeEach(async () => {
    user = await new User({ username: 'testuser', password: 'password' }).save();
  });

  it('should get all study sets', async () => {
    await new StudySet({ name: 'Test Study Set', user: user._id }).save();
    const res = await request(app).get('/study-sets');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(1);
  });

  it('should create a new study set', async () => {
    const res = await request(app)
      .post('/study-sets')
      .send({
        name: 'Test Study Set'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Test Study Set');
  });

  describe('with a study set', () => {
    let studySet;
    beforeEach(async () => {
      studySet = await new StudySet({ name: 'Test Study Set', user: user._id }).save();
    });

    it('should get a study set by id', async () => {
      const res = await request(app).get(`/study-sets/${studySet._id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'Test Study Set');
    });

    it('should update a study set', async () => {
      const res = await request(app)
        .put(`/study-sets/${studySet._id}`)
        .send({
          name: 'Updated Test Study Set'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'Updated Test Study Set');
    });

    it('should delete a study set', async () => {
      const res = await request(app).delete(`/study-sets/${studySet._id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Study set deleted successfully');
    });
  });
});
