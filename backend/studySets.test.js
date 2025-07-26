const request = require('supertest');
const express = require('express');
const studySetsRouter = require('./studySets');

const app = express();
app.use(express.json());
app.use('/study-sets', studySetsRouter);

describe('Study Sets routes', () => {
  it('should get all study sets', async () => {
    const res = await request(app).get('/study-sets');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should create a new study set', async () => {
    const res = await request(app)
      .post('/study-sets')
      .send({
        name: 'Test Study Set'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Test Study Set');
  });

  it('should get a study set by id', async () => {
    const postRes = await request(app)
      .post('/study-sets')
      .send({
        name: 'Test Study Set 2'
      });
    const res = await request(app).get(`/study-sets/${postRes.body.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Test Study Set 2');
  });

  it('should update a study set', async () => {
    const postRes = await request(app)
      .post('/study-sets')
      .send({
        name: 'Test Study Set 3'
      });
    const res = await request(app)
      .put(`/study-sets/${postRes.body.id}`)
      .send({
        name: 'Updated Test Study Set 3'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('name', 'Updated Test Study Set 3');
  });

  it('should delete a study set', async () => {
    const postRes = await request(app)
      .post('/study-sets')
      .send({
        name: 'Test Study Set 4'
      });
    const res = await request(app).delete(`/study-sets/${postRes.body.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
  });
});
