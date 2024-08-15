const express = require("express")
const UserController = require("../controller/UserController");
const router = express.Router()
router.post("/login",UserController.Login)
router.post("/register",UserController.UserRegister)
module.exports = router