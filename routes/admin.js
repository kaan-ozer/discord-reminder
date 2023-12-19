const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/', adminController.getIndex);

// -- REMINDERS --
router.get('/reminders', adminController.getReminders);

router.post('/reminders', adminController.postReminder);

router.get('/edit-reminder/:ID', adminController.getEditReminder);

router.post('/edit-reminder/:ID', adminController.postEditReminder);

router.post('/reminders/:ID', adminController.deleteReminder);

// -- DOMAINS --

router.get('/domains', adminController.getDomains);

router.post('/domains', adminController.postAddDomain);

router.get('/edit-domain/:ID', adminController.getEditDomain);

router.post('/edit-domain/:ID', adminController.postEditDomain);

router.post('/domains/:ID', adminController.deleteDomain);

// -- SERVICES --

// service to send messages
router.get('/remind-task/:ID', adminController.remindTask);

router.get('/remind-domain', adminController.remindDomain);

// api to get list
router.get('/domains-list', adminController.getDomainList);

module.exports = router;
