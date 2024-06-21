const {register,login} = require('../UserController/UserController');

const router = require('express').Router();

router.post("/register",register)
router.post("/login",login)


module.exports = router