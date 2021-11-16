const express = require('express');
const router = express.Router();
const { redirectLink, newUrl, getStats } = require('../controllers/url');

router.post('/shorturl/new', newUrl);
router.get('/:id', redirectLink);
router.get('/statistic/:shortUrlId', getStats);

module.exports = router;
