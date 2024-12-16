const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async function(req, res, next){
    try{
        let { auth_token } = req.cookies;

        const token = auth_token;

        if(!token){
            return res
            .status(401)
            .json({ status: false, message: "Not authorized. Try login again." })
        }

        const decodedToken = await jwt.verify(token, "yurtgtfthhlj");

        const userId = decodedToken.userId;
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                status: false,
                message: "User not found"
            })
        }

        req.user = user;

        next();
    }catch(error){
        res.status(400).json({
            status: false,
            message: "Not authorized. Try login again."
        })
    }
}

module.exports = { userAuth }