var express = require('express')
var router = express.Router()
const conversationController = require('../controllers/conversation.controller')
const authMiddleware = require('../middlewares/auth.middleware')
// middleware that is specific to this router
router.use(authMiddleware.isAuth)

router.post('/', conversationController.createConversation)

router.get('/', conversationController.getAllConversation)

router.get('/get_last_conversation', conversationController.getLastConversation)
router.get('/:user_id', conversationController.getConversation)


router.put('/:conversationId', function (req, res) {
  res.send('update conversation')
})

router.delete('/:conversationId', conversationController.deleteConversation)

module.exports = router