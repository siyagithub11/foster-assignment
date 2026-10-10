const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getUnclaimed, getMine, claimEnquiry } = require('../controllers/enquiry.controller');

router.use(protect);

router.get('/unclaimed', getUnclaimed);
router.get('/mine', getMine);
router.patch('/:id/claim', claimEnquiry);

module.exports = router;