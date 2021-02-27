const express = require('express')
const router = express.Router()
const friendController = require('../controllers/friend.controller')
const authMiddleware = require('../middlewares/auth.middleware')
// middleware that is specific to this router
router.use(authMiddleware.isAuth)

router.post('/send_request_friend', friendController.sendRequestFriend)

router.get('/get_all_sent_request_friends', friendController.getAllSentRequestFriends)

router.get('/get_all_received_request_friends', friendController.getAllReceivedRequestFriends)

router.get('/get_all_blocks', friendController.getAllBlocks)

router.get('/get_all_friends', friendController.getAllFriends)

router.post('/cancel_request_friend', friendController.cancelRequestFriend)

router.post('/set_accept_request_friend', friendController.setAcceptRequestFriend)
router.post('/set_unfriend', friendController.setUnfriend)
module.exports = router