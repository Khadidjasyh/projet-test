const { Router } = require('express');
const { getMobileNetworks } = require('../controllers/huaweiController');

const router = Router();

router.get('/mobile-networks', getMobileNetworks);

module.exports = router;