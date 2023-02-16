const nodemailer = require("nodemailer");
require("dotenv").config();

const registerEmail = async (data) => {
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { name, email, token } = data;

  await transport.sendMail({
    from: "Property-Store",
    to: email,
    subject: "Confirm account in Property-Store",
    html: `
        <p>Hello ${name}!, please confirm your account for Property-Store.com</p>
        <p>For your account confirmation just clicking in the following Link <a href="${
          process.env.BACKEND_URL
        }:${
      process.env.PORT ?? 3000
    }/auth/confirm-account/${token}">Confirm Account</a></p>
        <p>If you did not create account, just dismiss this message.</p>
        `,
  });
};
const recoverPasswordEmail = async (data) => {
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { name, email, token } = data;

  await transport.sendMail({
    from: "Property-Store",
    to: email,
    subject: "Recover Password",
    html: `
        <p>Hello ${name}!, You have requested to recover your password for Property-Store.com</p>
        <p>Getting a new password just clicking in the following Link <a href="${
          process.env.BACKEND_URL
        }:${
      process.env.PORT ?? 3000
    }/auth/recover-password/${token}">Recove Password</a></p>
        <p>If you did not request to recover password, just dismiss this message.</p>
        `,
  });
};

module.exports = { registerEmail, recoverPasswordEmail };
