const User = require('../models/user');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

exports.newUser = (req, res, next) => {
  const { email, username, password } = req.body;
  User.find({ email }, function (err, docs) {
    if (!docs.length) {
      User.create({
        email,
        username,
        password,
      })
        .then(() => {
          res.send('created');
        })
        .catch((err) => {
          next({ status: 401, error: err });
        });
    } else {
      next({ status: 401, error: 'invalid email' });
    }
  });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.find({ email, password })
    .then((user) => {
      if (user.length === 1) {
        jwt.sign(
          { user: user[0] },
          'secretkey',
          { expiresIn: '1h' },
          (err, token) => {
            res.json({
              token,
            });
          }
        );
      } else {
        throw { status: 401, error: 'invaild user' };
      }
    })
    .catch((err) => {
      next(err);
    });
};
