const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const fs = require('fs');
const validator = require('validator');
const Database = require('../database/dbClass');

router.post('/api/shorturl/new', (req, res, next) => {
  const urlCode = shortid.generate();
  if (!validator.isURL(req.body.longURL)) {
    next({ status: 400, message: { error: 'Invalid URL' } });
  }
  const urlData = new Database(
    req.body.longURL,
    urlCode,
    `https://shortyllink.herokuapp.com/${urlCode}`
  );
  const save = urlData.saveToDB();
  if (save) res.send(save);
  res.send(`https://shortyllink.herokuapp.com/${urlCode}`);
});

router.get('/:code', (req, res, next) => {
  let code = req.params.code;
  let dbArray = JSON.parse(fs.readFileSync('./database/DB.json', 'utf8'));
  if (code in dbArray) {
    dbArray[code]['count'] += 1;
    fs.writeFileSync('./database/DB.json', JSON.stringify(dbArray));
    return res.redirect(301, dbArray[code]['longUrl']);
  }
  next({ status: 404, message: { error: 'no such url' } });
});

router.get('/api/statistic/:shortUrlId', ({ params }, res, next) => {
  const { shortUrlId } = params;
  try {
    const urlData = JSON.parse(
      fs.readFileSync('./database/DB.json', 'utf8')
    ).shortUrlId;

    if (!urlData) {
      throw { status: 404, message: { error: 'no such url' } };
    }
    const {
      date: creationDate,
      count: redirectCount,
      longUrl: originalUrl,
    } = urlData;
    res.send({
      creationDate,
      redirectCount,
      originalUrl,
      'shorturl-id': shortUrlId,
    });
  } catch (error) {
    if (!error.status) next({ status: 500, message: { error } });
    else next(error);
  }
});

module.exports = router;
