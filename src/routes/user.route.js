const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')

var multer = require("multer")
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })
// middleware that is specific to this router
// router.use(authMiddleware.isAuth)

router.get('/', userController.getAllUsers)

router.post('/', userController.signup)

router.get('/:user_id', authMiddleware.isAuth, userController.getInfoUser)

router.put('/:user_id', authMiddleware.isAuth, userController.updateInfoUser)

router.delete('/:user_id', authMiddleware.isAuth, userController.deleteUser)
router.post('/upload_avatar', authMiddleware.isAuth, upload.single('avatar'), userController.uploadAvatar)

module.exports = router