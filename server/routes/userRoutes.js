const express = require("express");
const { registerUser, loginUser, logoutUser, changePassword, addMember, editMember, getTeam, removeMember } = require("../controllers/userController");
const { userAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/change-password", userAuth, changePassword);

router.put("/add-member", userAuth, addMember);

router.put("/edit-member", userAuth, editMember);

router.put("/remove-member", userAuth, removeMember);

router.get("/team", userAuth, getTeam);

router.delete("/logout", userAuth, logoutUser);

module.exports = router;