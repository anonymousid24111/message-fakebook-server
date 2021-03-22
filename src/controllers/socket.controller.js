const { RECEIVE_MESSAGE, NEW_CONVERSATION, TYPING, ISREAD, RECEIVED } = require('../commons/socketEvents');
const conversationModel = require('../models/conversation.model')
const userModel = require('../models/user.model')
const join = async (io, socket, { conversationId, userId, members }) => {
    console.log("join", userId, conversationId)
    if (conversationId) {
        // join conversation as set read status for conversation
        var conversationInfo = await conversationModel.findOneAndUpdate({
            _id: conversationId,
            "last_message.sender": {
                $ne: userId
            },
            "last_message.is_read": {
                $ne: 2
            }
        }, {
            $set: {
                "last_message.is_read": 2,
                "messages.$[].status": "read"
            }
        })
        // console.log('conversationInfo', conversationInfo?.members, conversationId, userId, members)
        socket.join(conversationId);
        members.map(element => {
            // console.log('element', element)
            io.to(element).emit(ISREAD, {
                userId,
                conversationId
            })
        });

    } else {
        // join by user id as set received all of conversation what have sender of last message not user id 
        userId && socket.join(userId);
        await conversationModel.updateMany({
            members: {
                $in: [userId]
            },
            "last_message.sender": {
                $ne: userId
            },
            "last_message.is_read": 0
        }, {
            "$set": {
                "last_message.is_read": 1,
                "messages.$[].status": "received"
            },
        })
        // io.to()
    }
}

const isRead = async (io, socket, { conversationId, userId, receiverId }) => {
    await conversationModel.findOneAndUpdate({
        _id: conversationId,
        "last_message.sender": {
            $ne: userId
        },
        "last_message.is_read": {
            $ne: 2
        }
    }, {
        "$set": {
            "last_message.is_read": 2,
            "messages.$[].status": "read"
        },
    })
    // members.map(element => {
    //     console.log('isread', element)
    //     socket.to(element).emit(ISREAD, {
    //         userId,
    //         conversationId
    //     })
    // });
    console.log("read", conversationId, userId, receiverId)
    io.to(receiverId).to(userId).emit(ISREAD, {
        senderId: userId,
        userId,
        conversationId
    })
}



const outRoom = (io, socket, data) => {
    console.log(`${socket.id} out ${data}`);
    socket.leave(data);
}

const receivedMessage = async (io, socket, { conversationId, userId, receiverId }) => {
    const result = await conversationModel.findOneAndUpdate({
        _id: conversationId,
        "last_message.sender": {
            $ne: userId
        },
        "last_message.is_read": 0
    }, {
        "$set": {
            "last_message.is_read": 1,
            "messages.$[].status": "received"
        },
    })
    io.to(receiverId).emit(RECEIVED, {
        userId,
        conversationId
    })
}




const typing = (io, socket, data) => {
    // console.log('data.conversationId', socket.id, data.sender, data.typing, data.conversationId)
    socket.to(data.conversationId).emit(TYPING, data)

    // socket.leave(data);
}

const sendMessage = async (io, socket, { message = {}, conversationId = "", receiver, sender }) => {
    console.log("send mes", sender)
    try {
        let created = Date.now()
        if (conversationId) {
            const newConversation = await conversationModel.findByIdAndUpdate(conversationId, {
                $push: {
                    messages: {
                        ...message,
                        status: "sent",
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
            // console.log("receiver", receiver)

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
                last_message: {
                    ...message,
                    is_read: 0,
                    sender,
                    created
                },
                messages: [
                    {
                        ...message,
                        sender,
                        created
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

            const resNewConversation = await conversationModel.findById(newConversation._id).populate({
                path: "members",
                select: "avatar username email"
            })

            io.to(receiver).to(sender).emit(NEW_CONVERSATION, resNewConversation)
        }

    } catch (error) {
        console.log(error)
    }
}



module.exports = {
    join,
    sendMessage,
    outRoom,
    typing,
    receivedMessage,
    isRead
}