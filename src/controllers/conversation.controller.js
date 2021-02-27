const { json } = require('body-parser')
const statusResponse = require('../commons/statusResponse')
const conversationModel = require('../models/conversation.model')
const userModel = require('../models/user.model')

const createConversation = async (req, res) => {
    const { friendId } = req.body
    const { id } = req?.decoded || req.body
    try {
        const friendInfo = await userModel.findById(friendId);
        if (friendInfo == null) {
            throw new Error("friend not found")
        }
        const conversationInfo = await conversationModel.findOne({
            members: {
                $all: [friendId, id]
            }
        })
        if (conversationInfo) {
            throw new Error("conversation existed")
        }
        const newConversation = await new conversationModel({
            members: [id, friendId]
        }).save()
        await userModel.findByIdAndUpdate(id, {
            $push: {
                conversations: newConversation?._id
            }
        })
        await userModel.findByIdAndUpdate(friendId, {
            $push: {
                conversations: newConversation?._id
            }
        })
        res.json(newConversation)
    } catch (error) {
        res.json(error?.message)
    }
}

const getAllConversation = async (req, res) => {
    const { id } = req.decoded
    try {
        const { conversations } = await userModel.findById(id).populate({
            path: "conversations",
            populate: {
                path: "members",
                select: "username avatar email"
            }
        })
        return res.json({
            ...statusResponse.OK,
            data: [
                ...conversations
            ]
        })
    } catch (error) {
        res.json(statusResponse.UNKNOWN)
    }
}

const getConversation = async (req, res) => {
    // console.log("get")
    const { user_id } = req.params
    const { id } = req.decoded
    try {
        if (!user_id) return res.json(statusResponse.PARAMS_MISS)
        if (user_id === id) {
            const { myConversation, username, email, avatar, _id } = await userModel.findById(id).populate('myConversation')
            return res.json({
                ...statusResponse.OK,
                data: {
                    member: {
                        username, email, avatar, _id
                    },
                    coversation: myConversation
                }
            })
        }
        const [userInfo, meInfo] = await Promise.all([
            userModel.findById(user_id).select("username email avatar conversations"),
            userModel.findById(id).select("username email avatar conversations").populate("conversations")])
        if (!meInfo || !user_id) return res.json(statusResponse.NOT_FOUND)
        const { conversations } = meInfo

        // console.log(userInfo)
        return res.json({
            ...statusResponse.OK,
            data: {
                member: userInfo,
                conversations: conversations&&conversations.find(conversation => conversation?.members.some(x => x == user_id))
            }
        })
    } catch (error) {
        console.log(error?.message)
        res.json(statusResponse.UNKNOWN)
    }
}

const deleteConversation = async (req, res) => {
    const { conversationId } = req.params
    try {
        const result = await conversationModel.findByIdAndDelete(conversationId)
        res.json(result)
    } catch (error) {
        res.json(error?.message)
    }
}

const getLastConversation = async (req, res) => {
    const { id } = req.decoded
    try {
        const { conversations } = await userModel.findById(id).populate({
            path: "conversations",
            select: "members",
            sort: {
                _id: -1
            },
            limit: 1
        })
        console.log(conversations)
        res.json({
            ...statusResponse.OK,
            data: conversations
        })
    } catch (error) {

    }
}


module.exports = {
    createConversation,
    getAllConversation,
    getConversation,
    deleteConversation,
    getLastConversation
}