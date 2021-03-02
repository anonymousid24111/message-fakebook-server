const express = require('express')
const router = express.Router()
const uploadController = require('../controllers/upload.controller')
const authMiddleware = require('../middlewares/auth.middleware')

var multer = require("multer")
var upload = multer({ dest: 'tmp' })

// middleware that is specific to this router
// router.use(authMiddleware.isAuth)

router.post('/images', authMiddleware.isAuth, upload.array('images'), uploadController.uploadImages)

module.exports = router