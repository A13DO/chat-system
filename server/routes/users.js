const express = require("express");
const router = express.Router();
const { users, getUserById } = require('../controllers/users');






router.route("/")
    .get(users)

router.route("/:id")
    .get(getUserById)


module.exports = router;