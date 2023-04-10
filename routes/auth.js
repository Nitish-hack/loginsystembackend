const {
  login,
  register,
  sendOTP,
  verifyOTP
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/login", login);
router.post("/register", register);
router.post("/sendotp", sendOTP);
router.post("/verifyotp", verifyOTP);



module.exports = router;
