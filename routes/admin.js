const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/', adminController.getIndex);

router.get('/domains', adminController.getDomains);

router.post('/domains', adminController.postAddDomain);

router.get('/edit-domain/:ID', adminController.getEditDomain);

router.post('/edit-domain/:ID', adminController.postEditDomain);

router.post('/domains/:ID', adminController.deleteDomain);

// service to send messages
router.get('/send-message', adminController.sendMessage);

// api to get list
router.get('/domains-list', adminController.getDomainList);

module.exports = router;
