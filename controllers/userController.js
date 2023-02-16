const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const User = require("../model/user");
const createId = require("../helpers/token");
const { recoverPasswordEmail, registerEmail } = require("../helpers/emails");

const loginForm = (req, res) => {
  res.render("auth/login", {
    page: "Log In",
    csrfToken: req.csrfToken(),
  });
};

const authenticate = async (req, res) => {
  await body("email").isEmail().withMessage("Email is required").run(req);
  await body("password")
    .notEmpty()
    .withMessage("Password is required")
    .run(req);
  let result = validationResult(req);

  if (!result.isEmpty()) {
    //errors
    return res.render("auth/login", {
      page: "Log In",
      errors: result.array(),
      csrfToken: req.csrfToken(),
    });
  }
};

const registerForm = (req, res) => {
  res.render("auth/register", {
    page: "Create Account",
    csrfToken: req.csrfToken(),
  });
};

const register = async (req, res) => {
  //validations
  await body("name").notEmpty().withMessage("Name is required").run(req);
  await body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Email is required")
    .run(req);
  await body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be 6 digits min")
    .run(req);
  await body("confirmedPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Password does not match")
    .run(req);
  let result = validationResult(req);

  if (!result.isEmpty()) {
    //errors
    return res.render("auth/register", {
      page: "Create Account",
      errors: result.array(),
      csrfToken: req.csrfToken(),
      user: {
        name: req.body.name,
        email: req.body.email,
      },
    });
  }
  const { name, email, password } = req.body;

  //checking for duplicated user
  const alreadyUser = await User.findOne({ where: { email } });
  if (alreadyUser) {
    return res.render("auth/register", {
      page: "Create Account",
      errors: [{ msg: "User already registered" }],
      csrfToken: req.csrfToken(),
      user: {
        name: req.body.name,
        email: req.body.email,
      },
    });
  }

  //creating user
  const user = await User.create({ name, email, password, token: createId() });

  //sending confirmation email
  registerEmail({
    name: user.name,
    email: user.email,
    token: user.token,
  });

  //show message successfully
  res.render("template/message", {
    page: "Account Created",
    message: "Confirm your account, click in the following Link:",
  });
};

const confirmAccount = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ where: { token } });
  if (!user) {
    return res.render("auth/confirm-account", {
      page: "Error to confirm account",
      message: "Something was wrong. Please, try again.",
      error: true,
    });
  }

  (user.token = null), (user.confirmed = true);

  await user.save();
  return res.render("auth/confirm-account", {
    page: "Account confirmed.",
    message: "Your account was created successfully.",
  });
};

const recoverPasswordForm = (req, res) => {
  res.render("auth/recover-password", {
    page: "Recover Password",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  await body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Email is required")
    .run(req);

  let result = validationResult(req);

  if (!result.isEmpty()) {
    //errors
    return res.render("auth/recover-password", {
      page: "Recover Password",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.render("auth/recover-password", {
      page: "Recover Password",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "Email does not match with current users" }],
    });
  }

  user.token = createId();
  await user.save();

  recoverPasswordEmail({
    email: user.email,
    name: user.name,
    token: user.token,
  });

  res.render("template/message", {
    page: "Recover Password",
    message: "Check your email and follow the given instructions",
  });
};

const checkingToken = async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ where: { token } });
  if (!user) {
    return res.render("auth/recover-password", {
      page: "Recover Password",
      message: "Something was wrong. Please, try again.",
      error: true,
    });
  }
  res.render("auth/reset-password", {
    page: "Reset Password",
    csrfToken: req.csrfToken(),
  });
};

const newPassword = async (req, res) => {
  await body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be 6 digits min")
    .run(req);

  let result = validationResult(req);
  if (!result.isEmpty()) {
    //errors
    return res.render("auth/reset-password", {
      page: "Reset Password",
      errors: result.array(),
      csrfToken: req.csrfToken(),
    });
  }

  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ where: { token } });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.token = null;

  await user.save();

  return res.render("auth/confirm-account", {
    page: "Password recovered",
    message: "Your password was updated.",
  });
};

module.exports = {
  loginForm,
  authenticate,
  registerForm,
  register,
  recoverPasswordForm,
  confirmAccount,
  resetPassword,
  checkingToken,
  newPassword,
};
