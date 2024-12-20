const jwt = require("jsonwebtoken");
const User = require("../models/user");

// const isTokenExpired = async function(token){
//     const currentTime = Math.floor(Date.now() / 1000);

//     if (token.exp < currentTime) {
//         console.log("decoded.exp : ", token.exp);
//         console.log("currentTime : ", currentTime);
//         return true;
//     }

//     return false;
// }

const userAuth = async function(req, res, next){
    try{
        let { auth_token } = req.cookies;

        const token = auth_token;

        if(!token){
            return res
            .status(401)
            .json({ status: false, message: "Token has Expired. Please login again." })
        }

        const decodedToken = jwt.verify(token, "yurtgtfthhlj");
        const currentTimestamp = Math.floor(Date.now() / 1000);

        if(decodedToken.exp <= currentTimestamp){
            return res.status(401).json({
                status: false,
                message: "Token has expired. Please login again."
            });
        }

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