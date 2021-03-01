const { RECEIVE_MESSAGE, NEW_CONVERSATION } = require('../commons/socketEvents');
const conversationModel = require('../models/conversation.model')
const userModel = require('../models/user.model')
const join = (io, socket, data) => {
    console.log(`${socket.id} joining ${data}`);
    socket.join(data);
}

const outRoom = (io, socket, data) => {
    console.log(`${socket.id} out ${data}`);
    socket.leave(data);
}

const sendMessage = async (io, socket, { message = {}, conversationId = "", receiver, sender }) => {
    console.log(socket.id, "emit event send")
    try {
        if (conversationId) {
            let created = Date.now()
            const newConversation = await conversationModel.findByIdAndUpdate(conversationId, {
                $push: {
                    messages: {
                        ...message,
                        sender,
                        created
                    }
                },
                $set: {
                    last_message: {
                        ...message,
                        is_read: 0,
                        sender,
                        created
                    }
                }
            }, { new: true }).populate({
                path: "members",
                select: "avatar username email"
            })
            console.log("receiver", receiver)

            socket.to(conversationId).emit(RECEIVE_MESSAGE, {
                ...message,
                sender,
                conversationId,
                created
            })
            io.to(receiver).to(sender).emit(NEW_CONVERSATION, newConversation)

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
            io.to(receiver).emit(NEW_CONVERSATION, {
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
    sendMessage,
    outRoom
}