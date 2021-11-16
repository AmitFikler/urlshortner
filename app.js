require('dotenv').config();
const express = require('express');
const cors = require('cors');
const shortUrl = require('./routers/shortURL');
const usersRouter = require('./routers/usersRouter');
const app = express();
const errorHandler = require('./middleware/errorHandler');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

app.use('/', express.static(`./front/dist/`));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/front/dist/index.html');
});

app.use('/api', verifyToken, shortUrl);
app.use('/user', usersRouter);
app.use(errorHandler);

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== undefined) {
    const beaber = bearerHeader.split(' ');
    req.token = beaber[1];
    next();
  } else {
    res.json({ status: 403, err: 'err' });
  }
}
module.exports = app;
