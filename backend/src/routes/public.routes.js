const router = require('express').Router();
const { createPublicEnquiry } = require('../controllers/enquiry.controller');

router.post('/enquiries', createPublicEnquiry);

module.exports = router;