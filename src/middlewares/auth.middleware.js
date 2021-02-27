const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken")
const accessTokenSecret = process.env.SECRET_STRING;

let isAuth = async (req, res, next) => {
    const tokenFromClient =
        req.body?.token || req.query?.token || req.headers["x-access-token"]
    try {
        if (!tokenFromClient) throw new Error("token null")
        const decoded = await jwt.verify(
            tokenFromClient,
            accessTokenSecret
        );
        // console.log(decoded)
        req.decoded = decoded;
        next();
    } catch (error) {
        res.json(error?.message)
    }
};

module.exports = {
    isAuth
};