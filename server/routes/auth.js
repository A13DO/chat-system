const express = require("express");
const router = express.Router();
const {register, login} = require("../controllers/auth");






router.route("/register")
    .post(register)


router.route("/login")
    .post(login)


module.exports = router;

// login
// create token


// get
// authorize the token to reach the data