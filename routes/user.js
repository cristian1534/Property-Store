const express = require("express");
const router = express();
const { loginForm, registerForm, recoverPasswordForm, register } = require("../controllers/userController");

router.get("/login", loginForm);
router.get("/register", registerForm)
router.post("/register", register)
router.get("/recover-password", recoverPasswordForm)

module.exports = router;
