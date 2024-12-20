const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const teamMemberSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    team: [teamMemberSchema],
    tasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        }
    ],
    assignedTasks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        }
    ],
    isAdmin: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.createJWT = async function(){
    const token = await jwt.sign({userId: this._id}, "yurtgtfthhlj", {expiresIn: "6h"});
    return token;
}

const User = mongoose.model("User", userSchema);
module.exports = User;