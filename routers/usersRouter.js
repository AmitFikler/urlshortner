const express = require('express');
const router = express.Router();
const { newUser, login } = require('../controllers/user');

router.post('/signup', newUser);
router.put('/login', login);
module.exports = router;
