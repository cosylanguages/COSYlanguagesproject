const request = require('supertest');
const express = require('express');
const quotesRouter = require('./quotes');
const fetch = require('node-fetch');

jest.mock('node-fetch');

const app = express();
app.use('/quotes', quotesRouter);

describe('GET /quotes/daily', () => {
  it('should return a random quote', async () => {
    const mockQuote = { content: 'This is a test quote', author: 'Test Author' };
    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockQuote),
    });

    const res = await request(app).get('/quotes/daily');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mockQuote);
  });

  it('should return 500 on error', async () => {
    fetch.mockRejectedValue(new Error('API is down'));

    const res = await request(app).get('/quotes/daily');
    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Error fetching daily quote');
  });
});
