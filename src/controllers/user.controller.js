const statusResponse = require('../commons/statusResponse');
const userModel = require('../models/user.model')
const { streamUpload } = require("../services/upload.service")

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
        const userInfo = await userModel.findById(user_id).select("username cover_image avatar email birthday friends");
        if (!userInfo) return res.json(statusResponse.NOT_FOUND)
        return res.json({
            ...statusResponse.OK,
            data: userInfo
        })
    } catch (error) {
        res.json(statusResponse.UNKNOWN)
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
    const { user_id } = req.params
    const { username, phonenumber, email, birthday } = req.body;
    try {
        let userInfo = await userModel.findById(user_id)
        if (userInfo) {
            console.log(`req.body`, req.body)
            username && (userInfo.username = username);
            email && (userInfo.email = email);
            phonenumber && (userInfo.phonenumber = phonenumber);
            birthday && (userInfo.birthday = birthday);
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


const uploadAvatar = async (req, res) => {
    const { id } = req.decoded
    try {
        var result = await streamUpload(req)
        await userModel.findByIdAndUpdate(id, {
            $set: {
                avatar: result?.secure_url
            }
        })
        res.json({
            ...statusResponse.OK,
            data: {
                avatar: result?.secure_url
            }
        })
    }
    catch (error) {
        console.log(error)
        res.json(statusResponse.UNKNOWN)
    }
}

const uploadCoverImage = async (req, res) => {
    const { id } = req.decoded
    try {
        var result = await streamUpload(req)
        await userModel.findByIdAndUpdate(id, {
            $set: {
                cover_image: result?.secure_url
            }
        })
        res.json({
            ...statusResponse.OK,
            data: {
                cover_image: result?.secure_url
            }
        })
    }
    catch (error) {
        console.log(error)
        res.json(statusResponse.UNKNOWN)
    }
}

module.exports = {
    signup,
    getInfoUser,
    getAllUsers,
    deleteUser,
    updateInfoUser,
    uploadAvatar,
    uploadCoverImage
}