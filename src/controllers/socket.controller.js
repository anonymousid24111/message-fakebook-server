const { RECEIVE_MESSAGE } = require('../commons/socketEvents');
const conversationModel = require('../models/conversation.model')
const userModel = require('../models/user.model')
const join = (io, socket, data) => {
    console.log(`${socket.id} joining ${data}`);
    socket.join(data);
}

const sendMessage = async (io, socket, { message = {}, conversationId = "", receiver, sender }) => {
    console.log(socket.id, "emit event send")
    try {
        if (conversationId) {
            await conversationModel.findByIdAndUpdate(conversationId, {
                $push: {
                    messages: {
                        ...message,
                        sender,
                        created: Date()
                    }
                }
            })
            console.log("receiver", receiver)
            io.to(receiver).emit(RECEIVE_MESSAGE, {
                ...message,
                sender,
                conversationId
            })
        } else {

            const newConversation = new conversationModel({
                members: [
                    sender,
                    receiver
                ],
                messages: [
                    {
                        ...message,
                        sender,
                        created: Date()
                    }
                ]
            })
            if (sender === receiver) {
                await Promise.all([userModel.findByIdAndUpdate(sender, {
                    myConversation: newConversation._id
                }), newConversation.save()])
            }
            else {
                await Promise.all([userModel.updateMany({
                    $or: [
                        { _id: receiver },
                        { _id: sender }
                    ]
                }, {
                    $push: {
                        conversations: newConversation._id
                    }
                }), newConversation.save()])
            }
            io.to(receiver).emit(RECEIVE_MESSAGE, {
                ...message,
                sender,
                conversationId
            })
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    join,
    sendMessage
}