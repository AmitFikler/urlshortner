require('dotenv').config();
const express = require('express');
const cors = require('cors');
const shortUrl = require('./routers/shortURL');
const app = express();
const errorHandler = require('./middleware/errorHandler');

app.use(cors());
app.use(express.json());

app.use('/', express.static(`./front/dist/`));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/front/dist/index.html');
});

app.use('/', shortUrl);
app.use(errorHandler);
module.exports = app;
