const {JWT_AUTH} = require('../Middleware/JWT_AUTH');
const { register, login, verifyUser, resendVerification, updateUser, forgotPassword, verifyPasswordOTP, updatePassword } = require('../UserController/UserController');

const router = require('express').Router();

router.post("/register", register)
router.post("/login", login)
router.put("/updateUser",JWT_AUTH,updateUser)
router.get("/verify/:token", verifyUser)
router.get("/resendVerification/:token", resendVerification)
router.post("/resendVerification/", resendVerification)
router.post("/resetpassword", forgotPassword)
router.post("/verifyPasswordOTP", verifyPasswordOTP)
router.post("/updatepassword", updatePassword)


module.exports = router