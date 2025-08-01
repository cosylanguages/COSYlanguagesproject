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

app.use(express.json());
const mockAuth = require('./middleware/mockAuth');

app.use('/auth', authRouter);
app.use('/study-sets', mockAuth, studySetsRouter);
app.use('/progress', progressRouter);
app.use('/freestyle-progress', freestyleProgressRouter);
app.use('/booster-packs', boosterPacksRouter);
app.use('/posts', postsRouter);
app.use('/events', mockAuth, eventsRouter);

mongoose.connect('mongodb://localhost/cosylanguages', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
