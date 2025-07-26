const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3001;
const authRouter = require('./auth');
const studySetsRouter = require('./studySets');
const progressRouter = require('./progress');
const freestyleProgressRouter = require('./freestyleProgress');
const boosterPacksRouter = require('./boosterPacks');
const postsRouter = require('./posts');

app.use(express.json());
app.use('/auth', authRouter);
app.use('/study-sets', studySetsRouter);
app.use('/progress', progressRouter);
app.use('/freestyle-progress', freestyleProgressRouter);
app.use('/booster-packs', boosterPacksRouter);
app.use('/posts', postsRouter);

mongoose.connect('mongodb://localhost/cosylanguages', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
