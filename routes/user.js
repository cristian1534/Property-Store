const express = require("express");
const router = express();
const {
  loginForm,
  registerForm,
  recoverPasswordForm,
  register,
  confirmAccount,
  resetPassword,
  checkingToken,
  newPassword, 
  authenticate
} = require("../controllers/userController");

router.get("/login", loginForm);
router.post("/login", authenticate);
router.get("/register", registerForm);
router.post("/register", register);
router.get("/confirm-account/:token", confirmAccount);
router.get("/recover-password", recoverPasswordForm);
router.post("/recover-password", resetPassword);
//recovering password
router.get("/recover-password/:token", checkingToken);
router.post("/recover-password/:token", newPassword);
module.exports = router;
