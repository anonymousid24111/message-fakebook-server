const express = require('express')
const router = express.Router()
const searchController = require('../controllers/search.controller')
const authMiddleware = require('../middlewares/auth.middleware')
// middleware that is specific to this router
router.use(authMiddleware.isAuth)

router.get('/search_user', searchController.searchUser)


module.exports = router