const Url = require('../models/url');
const shortid = require('shortid');
const validator = require('validator');

exports.redirectLink = (req, res, next) => {
  let id = req.params.id;
  Url.findById(id)
    .then((urlObj) => {
      console.log(urlObj.count);
      Url.findByIdAndUpdate(id, { $set: { count: urlObj.count + 1 } }).then(
        () => {
          return res.redirect(301, urlObj.longUrl);
        }
      );
    })
    .catch(() => {
      next({ status: 404, message: { error: 'no such url' } });
    });
};

exports.newUrl = (req, res, next) => {
  const urlCode = shortid.generate();
  if (!validator.isURL(req.body.longURL)) {
    next({ status: 400, message: { error: 'Invalid URL' } });
  }
  Url.findOne({ longUrl: req.body.longURL }).then((check) => {
    if (!check) {
      Url.create({
        _id: urlCode,
        longUrl: req.body.longURL,
        shortUrl: `http://localhost:3000/api/${urlCode}`,
        count: 0,
        date: new Date(),
      }).then(() => {
        console.log('saved');
        res.send(`http://localhost:3000/api/${urlCode}`);
      });
    } else {
      res.send(check.shortUrl);
    }
  });
};

exports.getStats = ({ params }, res, next) => {
  const { shortUrlId } = params;
  Url.findById(shortUrlId)
    .then((urlData) => {
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
    })
    .catch((error) => {
      if (!error.status) next({ status: 500, message: { error } });
      else next(error);
    });
};
