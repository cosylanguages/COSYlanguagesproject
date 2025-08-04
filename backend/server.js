const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3001;
const authRouter = require('./auth');
const studySetsRouter = require('./studySets');
const progressRouter = require('./routes/progress');
const freestyleProgressRouter = require('./freestyleProgress');
const boosterPacksRouter = require('./boosterPacks');
const postsRouter = require('./routes/posts');
const eventsRouter = require('./routes/events');
const clubsRouter = require('./routes/clubs');
const authMiddleware = require('./middleware/auth');

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/study-sets', authMiddleware, studySetsRouter);
app.use('/api/progress', authMiddleware, progressRouter);
app.use('/api/freestyle-progress', authMiddleware, freestyleProgressRouter);
app.use('/api/booster-packs', boosterPacksRouter);
app.use('/api/posts', authMiddleware, postsRouter);
app.use('/api/events', authMiddleware, eventsRouter);
app.use('/api/clubs', clubsRouter);

mongoose.connect('mongodb://localhost/cosylanguages', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
