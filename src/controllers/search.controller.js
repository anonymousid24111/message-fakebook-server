const statusResponse = require("../commons/statusResponse")
const userModel = require("../models/user.model")

const searchUser = async (req, res) => {
    const { keyword } = req.query
    const { id } = req.decoded
    try {
        if (!keyword) {
            const [othersInfo, meInfo] = await Promise.all([userModel.find().select('username avatar email is_friend same_friends'), userModel.findById(id)])
            // const results = await 
            // console.log("res:",results)
            for(let i=0; i<othersInfo.length;i+=1){
                othersInfo[i]["is_friend"]= meInfo.friends.includes(othersInfo[i]._id)
            }
            // console.log(othersInfo)
            return res.json({
                ...statusResponse.OK,
                data: [
                    ...othersInfo
                ]
            })
        }
        const results = await userModel.find({
            $or: [
                { username: new RegExp(keyword, "i") },
                { username: new RegExp(keyword.replace(" ", "|"), "i") },
                { email: new RegExp(keyword, "i") },
                { email: new RegExp(keyword.replace(" ", "|"), "i") }
            ]
        }).select('username email')
        return res.json({
            ...statusResponse.OK,
            data: results
        })
    } catch (error) {
        res.json(statusResponse.UNKNOWN)
    }
}

module.exports = {
    searchUser
}
