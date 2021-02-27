const express = require('express')
const router = express.Router()
const tokenController = require('../controllers/token.controller')

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
    // console.log('Time: ', Date.now())
    next()
})

router.get('/', tokenController.verifyToken)

router.post('/login', tokenController.login)

router.post('/logout', function (req, res) {
    res.send('create new user- signup')
})

module.exports = router