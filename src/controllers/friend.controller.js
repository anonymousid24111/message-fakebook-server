const statusResponse = require('../commons/statusResponse');
const userModel = require('../models/user.model')

const sendRequestFriend = async (req, res) => {
    const { user_id } = req.body;
    const { id } = req.decoded
    // console.log(user_id, id)
    try {
        if (!user_id || user_id == id) return res.json(statusResponse.PARAMS_MISS)
        const [friendInfo, meInfo] = await Promise.all([userModel.findById(user_id), userModel.findById(id)])
        // console.log(friendInfo)
        if (!friendInfo) return res.json(statusResponse.NOT_FOUND)
        if (friendInfo?.friends.includes(id) ||
            meInfo?.friends.includes(user_id) ||
            meInfo.sentRequestFriends.some(x => x.user == user_id) ||
            friendInfo.receivedRequestFriends.some(x => x.user == id)) return res.json(statusResponse.SUCCEED)
        if (friendInfo?.blocks.includes(id) || meInfo?.blocks.includes(user_id)) return res.json(statusResponse.NOT_ACCEPT)
        if (friendInfo?.sentRequestFriends.some(x => x.user == id) || meInfo?.receivedRequestFriends.some(x => x.user == user_id)) {
            friendInfo.sentRequestFriends = friendInfo.sentRequestFriends.filter(x => x.user != id)
            meInfo.receivedRequestFriends = meInfo.receivedRequestFriends.filter(x => x.user != user_id)
            await Promise.all(friendInfo.save(), meInfo.save())
            return res.json(statusResponse.OK)
        }
        const dateNow = Date.now()
        meInfo.sentRequestFriends.push({
            created: dateNow,
            user: user_id
        })
        friendInfo.receivedRequestFriends.push({
            created: dateNow,
            user: id
        })
        await Promise.all([friendInfo.save(), meInfo.save()])
        return res.json(statusResponse.OK)
    } catch (error) {
        // console.log(error)
        res.json(statusResponse.UNKNOWN)
    }
}

const getAllSentRequestFriends = async (req, res) => {
    const { id } = req.decoded
    try {
        const { sentRequestFriends } = await userModel.findById(id).populate({
            path: "sentRequestFriends.user",
            select: "username avatar email"
        });
        // console.log(sentRequestFriends)
        return res.json({
            ...statusResponse.OK,
            data: {
                sentRequestFriends
            }
        })
    } catch (error) {
        res.json(statusResponse.UNKNOWN)
    }
}

const getAllReceivedRequestFriends = async (req, res) => {
    const { id } = req.decoded
    try {
        const { receivedRequestFriends } = await userModel.findById(id).populate({
            path: 'receivedRequestFriends.user',
            select: 'username email avatar'
        });

        // console.log(receivedRequestFriends)
        return res.json({
            ...statusResponse.OK,
            data: {
                receivedRequestFriends
            }
        })
    } catch (error) {
        res.json(statusResponse.UNKNOWN)
    }
}

const getAllFriends = async (req, res) => {
    const { id } = req.decoded
    try {
        const { friends } = await userModel.findById(id);
        return res.json({
            ...statusResponse.OK,
            data: {
                friends
            }
        })
    } catch (error) {
        res.json(statusResponse.UNKNOWN)
    }
}

const getAllBlocks = async (req, res) => {
    const { id } = req.decoded
    try {
        const { blocks } = await userModel.findById(id);
        return res.json({
            ...statusResponse.OK,
            data: {
                blocks
            }
        })
    } catch (error) {
        res.json(statusResponse.UNKNOWN)
    }
}

const setAcceptRequestFriend = async (req, res) => {
    const { user_id, is_accept } = req.body
    const { id } = req.decoded
    try {
        if (!user_id || is_accept == undefined) return res.json(statusResponse.PARAMS_MISS)
        const [friendInfo, meInfo] = await Promise.all([userModel.findById(user_id), userModel.findById(id)])
        if (!friendInfo) return res.json(statusResponse.NOT_FOUND)
        if (friendInfo?.blocks.some(x => x == id) || meInfo?.blocks.some(x => x == user_id)) return res.json(statusResponse.NOT_ACCEPT)
        if (is_accept == true) {
            if (friendInfo?.friends.some(x => x == id) || meInfo?.friends.some(x => x == user_id)) return res.json(statusResponse.SUCCEED)
            friendInfo?.friends.push(id)
            meInfo?.friends.push(user_id)
        }
        // console.log("frinfo", friendInfo)
        friendInfo.sentRequestFriends = friendInfo.sentRequestFriends.filter(x => x.user != id)
        meInfo.receivedRequestFriends = meInfo.receivedRequestFriends.filter(x => x.user != user_id)
        await Promise.all([friendInfo.save(), meInfo.save()])
        // console.log("debug", friendInfo.sentRequestFriends, meInfo.receivedRequestFriends)
        return res.json(statusResponse.OK)
    } catch (error) {
        // console.log(error)
        return res.json(statusResponse.UNKNOWN)
    }
}

const cancelRequestFriend = async (req, res) => {
    const { user_id } = req.body
    const { id } = req.decoded
    try {
        if (!user_id) return res.json(statusResponse.PARAMS_MISS)
        await Promise.all([userModel.findByIdAndUpdate(user_id, {
            $pull: {
                receivedRequestFriends: {
                    user: id
                }
            }
        }), userModel.findByIdAndUpdate(id, {
            $pull: {
                sentRequestFriends: {
                    user: user_id
                }
            }
        })])
        return res.json(statusResponse.OK)

    } catch (error) {
        // console.log(error)
        return res.json(statusResponse.UNKNOWN)
    }
}
const setUnfriend = async (req, res) => {
    const { user_id } = req.body
    const {id} = req.decoded
    try {
        if (!user_id) return res.json(statusResponse.PARAMS_MISS)

        await Promise.all([userModel.findByIdAndUpdate(user_id, {
            $pull: {
                friends: id
            }
        }), userModel.findByIdAndUpdate(id, {
            $pull: {
                friends: user_id
            }
        })])
        return res.json(statusResponse.OK)
    } catch (error) {
        console.log(error)
        return res.json(statusResponse.UNKNOWN)
    }
}


module.exports = {
    sendRequestFriend,
    getAllSentRequestFriends,
    getAllReceivedRequestFriends,
    getAllFriends,
    getAllBlocks,
    setAcceptRequestFriend,
    cancelRequestFriend,
    setUnfriend
}   