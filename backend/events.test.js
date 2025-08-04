const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');
const eventsRouter = require('./routes/events');
const authMiddleware = require('./middleware/auth');
const User = require('./models/user');

jest.setTimeout(30000);

const app = express();
app.use(express.json());
app.use('/events', authMiddleware, eventsRouter);

const JWT_SECRET = 'your_jwt_secret';
let mongoServer;
let testUser;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  testUser = new User({ username: 'testuser', password: 'password' });
  await testUser.save();

  const payload = { user: { id: testUser.id } };
  token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Events API', () => {
  describe('POST /events/add', () => {
    it('should return 401 if no token is provided', async () => {
      const res = await request(app)
        .post('/events/add')
        .send({
          title: 'Test Event',
          description: 'A test event description.',
        });
      expect(res.statusCode).toBe(401);
    });

    it('should create a new event if token is provided', async () => {
      const res = await request(app)
        .post('/events/add')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Event',
          level: 'Intermediate',
          clubType: 'The Greatest Quotes',
          description: 'A test event description.',
        });
      expect(res.statusCode).toBe(200);
      expect(res.body).toBe('Event added!');
    });
  });

  describe('GET /events', () => {
    it('should return 401 if no token is provided', async () => {
      const res = await request(app).get('/events');
      expect(res.statusCode).toBe(401);
    });

    it('should return an object with an array of events if token is provided', async () => {
      const res = await request(app)
        .get('/events')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.events)).toBe(true);
    });
  });
});
