const express = require('express')
const router = express.Router()
const fileController = require('../controller/file')
const rewardsController = require('../controller/rewards')

router.post('/file', fileController.uploadFile)
router.delete('/file', fileController.deleteFileContent)
router.get('/calculate-rewards', rewardsController.calculateRewards)

module.exports = router;
