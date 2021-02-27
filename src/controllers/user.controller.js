const statusResponse = require('../commons/statusResponse');
const userModel = require('../models/user.model')

const signup = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) return res.json(statusResponse.PARAMS_MISS)

        const userInfo = await userModel.find({ email: email })
        if (userInfo?.length > 0) return res.json(statusResponse.USER_EXISTED)

        await new userModel({
            email,
            password
        }).save()
        return res.json(statusResponse.OK)
    } catch (error) {
        res.json(statusResponse.UNKNOWN)
    }
}

const getInfoUser = async (req, res) => {
    const { user_id } = req.params;
    const { id } = req.decoded
    try {
        if (!user_id) return res.json(statusResponse.PARAMS_MISS)
        const userInfo=  await userModel.findById(user_id);
        if(!userInfo) return res.json(statusResponse.NOT_FOUND)
        const { username, email, birthday, friends, settings } = userInfo
        if (user_id == id) {
            return res.json({
                ...statusResponse.OK,
                data: {
                    username,
                    email,
                    birthday,
                    friends,
                    settings
                }
            })
        } else {
            return res.json({
                ...statusResponse.OK,
                data: {
                    username,
                    email,
                    birthday,
                    friends,
                    settings
                }
            })
        }
    } catch (error) {
        if (error) {
            res.json('unknown error')
        } else {
            res.json('unknown error')
        }
    }
}

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await userModel.find({})
        res.json(allUsers)
    } catch (error) {
        if (error) {
            res.json('unknown error')
        } else {
            res.json('unknown error')
        }
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const result = await userModel.deleteOne({ _id: id });
        res.json(result)
    } catch (error) {
        if (error) {
            res.json('unknown error')
        } else {
            res.json('unknown error')
        }
    }
}

const updateInfoUser = async (req, res) => {
    const { id } = req.params
    const { username, phonenumber } = req.body;
    try {
        let userInfo = await userModel.findById(id)
        if (userInfo) {
            userInfo.username = username;
            userInfo.phonenumber = phonenumber;
            await userInfo.save()
            res.json(userInfo)
        } else {
            throw new Error("user not found")
        }
    } catch (error) {
        if (error.message == "user not found") {
            res.json("user not found")
        } else {
            res.json("unknown error")
        }
    }
}



module.exports = {
    signup,
    getInfoUser,
    getAllUsers,
    deleteUser,
    updateInfoUser
}