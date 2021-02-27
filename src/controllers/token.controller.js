const userModel = require('../models/user.model')
const jwt = require("jsonwebtoken");
const statusResponse = require('../commons/statusResponse');
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if(!email||!password) return res.json(statusResponse.PARAMS_MISS)
        const userInfo = await userModel.findOne({ email, password });
        if (userInfo) {
            const token = jwt.sign({
                id: userInfo?._id,
            }, process.env.SECRET_STRING, { expiresIn: '24h' })
            return res.json({
                ...statusResponse.OK,
                token,
                username: userInfo?.username,
                user_id: userInfo?._id
            })
        } else {
            return res.json(statusResponse.NOT_VALIDATED)
        }
    } catch (error) {
        res.json(statusResponse.UNKNOWN)
    }
}

const logout = async (req, res) => {
    const {id} = req.params
    try {
        res.json("logout suc")
    } catch (error) {
        res.json(error?.message)
    }
}

const verifyToken =async (req, res) => {
    const {token} = req.body||req.params||req.query
    try {
        var decoded = await jwt.verify(token, process.env.SECRET_STRING);
        res.json(decoded)
        
    } catch (error) {
        res.json(error?.message)
    }
}


module.exports = {
    login,
    logout,
    verifyToken
}
