const express = require('express')
const router = express.Router()
const fileController = require('../controller/file')

router.post('/file', fileController.uploadFile)

module.exports = router
