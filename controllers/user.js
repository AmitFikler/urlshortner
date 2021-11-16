const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.newUser = (req, res, next) => {
  const { email, username, password } = req.body;
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
};

exports.login = (req, res, next) => {
  console.log(req);
  const { email, password } = req.body;
  User.find({ email, password })
    .then((user) => {
      if (user.length === 1) {
        jwt.sign({ user: user[0] }, 'secretkey', (err, token) => {
          res.json({
            token,
          });
        });
      } else {
        throw { status: 401, error: 'invaild user' };
      }
    })
    .catch((err) => {
      next(err);
    });
};
