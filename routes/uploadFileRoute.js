const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadFile');
const auth=require('../controllers/auth')
router.post('/upload',auth.protect, uploadController.uploadFile);

module.exports = router;
