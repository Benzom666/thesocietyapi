const express = require('express');
const validation = require('../helpers/validation');
const requestController = require('../controllers/v1/request');
const validateApi = require('../helpers/validateApi');

const router = express.Router();

/* get all requests */
router.get('/', validateApi, requestController.getAllRequests);
/* get requests sent by the logged-in male */
router.get('/sent', validateApi, requestController.getSentRequests);


/* Male request to Female only */
router.post('/send-request', validateApi, validation.validate('send-request'), requestController.sendRequest);


module.exports = router;