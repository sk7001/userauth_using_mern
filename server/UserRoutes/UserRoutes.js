const { register, login, verifyUser } = require('../UserController/UserController');

const router = require('express').Router();

router.post("/register", register)
router.post("/login", login)
router.get("/verify/:token", verifyUser)


module.exports = router