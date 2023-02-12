const { body, validationResult } = require("express-validator")
const User = require("../model/user");
const createId = require("../helpers/token");


const loginForm = (req, res) => {
  res.render("auth/login", {
    page: "Log In",
  });
};

const registerForm = (req, res) => {
  res.render("auth/register", {
    page: "Create Account",
  });
};



const register = async (req, res) => {
  //validations
  await body("name").notEmpty().withMessage("Name is required").run(req)
  await body("email").notEmpty().isEmail().withMessage("Email is required").run(req)
  await body('password').isLength({ min: 6 }).withMessage('Password must be 6 digits min').run(req)
  await body('confirmedPassword').custom((value, {req}) => value === req.body.password).withMessage('Password does not match').run(req)
  let result = validationResult(req)
  console.log(req.body)
  console.log(result)
  
  if(!result.isEmpty()){
    //errors
    return res.render("auth/register", {
      page: "Create Account",
      errors: result.array(),
      user: {
        name: req.body.name,
        email: req.body.email
      }
    })
  }
  const { name, email, password } = req.body

   //checking for duplicated user
  const alreadyUser = await User.findOne({where: {email}})
  if(alreadyUser) {
    return res.render("auth/register", {
      page: "Create Account",
      errors: [{msg: "User already registered"}],
      user: {
        name: req.body.name,
        email: req.body.email
      }
    })
  }

  //creating user
  await User.create({name, email, password, token: createId()})

  //show message successfully
  res.render("template/message", {
    page: "Account Created",
    message: "Confirm your account, click in the following Link:"
  })


};

const recoverPasswordForm = (req, res) => {
  res.render("auth/repeat-password", {
    page: "Recover Password",
  });
};





module.exports = {
  loginForm,
  registerForm,
  register,
  recoverPasswordForm,
};
