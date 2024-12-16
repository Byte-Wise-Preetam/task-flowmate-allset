const bcrypt = require("bcrypt");
const User = require("../models/user");
const Task = require("../models/task")

//  Parent route   >>   /api/user

//  Fetch team      /get-team      (GET)
const getTeam = async function(req, res, next){
    try{
        const user = req.user;

        const populatedUser = await user.populate("team", "_id firstName lastName email");

        const team = populatedUser.team;

        if(!team || team.length === 0){
            return res.status(404).json({
                status: false,
                message: "No team members found"
            })
        }

        return res.status(200).json({
            status: true,
            team
        })
    }catch(error){
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

// Register a new user  /register   (POST)
const registerUser = async function(req, res ,next){
    try{
        const {firstName, lastName, email, password, confirmPassword} = req.body;

        // checking whether password and confirmPassword are same or not
        if(password !== confirmPassword){
            return res.status(401).json({status: false, message: "Password and confirmPassword should be same"});
        }

        const userExist = await User.findOne({email});

        // checking whether the user already exists or not
        if(userExist){
            return res.status(409).json({status: false, message: "Email already exists"});
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create a new user
        const newUser = new User({
            firstName, 
            lastName, 
            email, 
            password: hashedPassword,
        })

        await newUser.save();
        res.status(201).json({status: true, message: 'User registered successfully' });
    }catch(error){
        res.status(500).json({status: false, error: error.message });
    }
}

//  Login a user    /login  (POST)
const loginUser = async function(req, res, next){
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email}).populate({
                path: 'team.memberId',
                select: 'firstName lastName'
            });

        if(!user){
            return res.status(401).json({status: false, message: "Invalid Credentials"});
        }

        const isMatch = await user.matchPassword(password); 

        if(!isMatch){
            return res.status(401).json({status: false, message: "Invalid Credentials"});
        }

        const token = await user.createJWT();

        console.log("token : ", token);

        user.password = undefined;

        return res.status(200).json({
            status: true,
            message: "User login successfully",
            user,
            token
        });

        //  ** For Postman **
        // res.cookie("auth_token", token, {
        //     httpOnly: true,
        //     maxAge: 0.25 * 24 * 60 * 60 * 1000,
        //     sameSite: 'none',
        //     path: '/'
        // })

        // return res.status(200).json({
        //     status: true,
        //     message: "User login successfully",
        //     user
        // });

    }catch(error){
        return res.send(400).json({status: false, error: error.message});
    }
}

//  Update password     /change-password    (PUT)
const changePassword = async function(req, res, next){
    try{
        const userId = req.user._id;
        const { password, confirmPassword } = req.body;

        if(password !== confirmPassword){
            return res.status(404).json({
                status: false,
                message: "Password and Confirm Password do not match."
            })
        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({
                status: false,
                message: "User not found or invalid Request"
            })
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({
            status: true,
            message: "Password changed successfully"
        })

    }catch(error){
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

//  Add a new member to the team      /add-member    (PUT)
const addMember = async function(req, res, next){
    try{
        const user = req.user;
        const { newMemberEmail, role } = req.body;

        const newMember = await User.findOne({email: newMemberEmail});

        if(!newMember || newMember._id.equals(user._id) || user.email === newMemberEmail){
            return res.status(404).json({
                status: false,
                message: "Invalid member id"
            })
        }

        const isMemberAlreadyExist = user.team.some((member) => member.email === newMember.email);

        if(isMemberAlreadyExist){
            return res.status(404).json({
                status: false,
                message: "Member already in the team"
            })
        }

        const AuthorizedNewMember = {
            email: newMemberEmail,
            role,
            memberId: newMember._id
        }

        user.team.push(AuthorizedNewMember);

        await user.save();

        const populatedUser = await User.findById(user._id)
            .populate({
                path: 'team.memberId',
                select: 'firstName lastName'
            })

        return res.status(200).json({
            status: true,
            message: "Member added successfully",
            populatedUser
        })
    }catch(error){
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

//  Edit a team member      /edit-member/   (PUT)
const editMember = async function(req, res, next){
    try{
        const user = req.user;
        const { newMemberEmail, role } = req.body;
        const memberEmail = newMemberEmail;

        const teamMember = await User.findOne({email: memberEmail});

        if(!teamMember){
            return res.status(404).json({
                status: false,
                message: "Invalid member id"
            })
        }

        const AuthorizedMember = {
            email: memberEmail,
            role,
            memberId: teamMember._id
        }

        user.team = user.team.map((teamMember) => teamMember.email === AuthorizedMember.email ? AuthorizedMember : teamMember);

        await user.save();

        const populatedUser = await User.findById(user._id)
            .populate({
                path: 'team.memberId',
                select: 'firstName lastName'
            })

        const editedMember = populatedUser.team.find((member) => member.email === memberEmail);

        return res.status(200).json({
            status: true,
            message: "Member Edited successfully",
            member: editedMember
        })
    }catch(error){
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

//  Remove a member from the team      /remove-member    (PUT)
const removeMember = async function(req, res, next){
    try{
        const user = req.user;
        const { memberEmail } = req.body;

        const member = await User.findOne({email: memberEmail});

        if(!member){
            return res.status(404).json({
                status: false,
                message: "Invalid member id"
            })
        }
        
        const isMemberExist = user.team.some((member) => member.email === memberEmail);

        if(!isMemberExist){
            return res.status(404).json({
                status: false,
                message: "Member does not exist in the team"
            })
        }

        const newTeam = user.team.filter((member) => member.email !== memberEmail);

        user.team = newTeam;
        await user.save();

        return res.status(200).json({
            status: true,
            message: "Member removed successfully"
        })

    }catch(error){
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
}

//  Logout a user   /logout     (DELETE)
const logoutUser = async function(req, res, next){
    try{
        return res.status(200).json({ status: true, message: "Logout successful" });
    }catch(error){
        return res.status(400).json({ status: false, message: error.message });
    }
}

module.exports = { registerUser, loginUser, logoutUser, changePassword, getTeam, addMember, editMember, removeMember };


