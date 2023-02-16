const express = require("express");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user");
const db = require("./config/database");
const app = express();
require("dotenv").config();

//database connection
try {
  db.authenticate();
  db.sync();
  console.log("Connection Successfully to MYSQL");
} catch (err) {
  console.log("Could not connect to MYSQL", err);
}

//data from forms
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csrf({ cookie: true }));

//views
app.set("view engine", "pug");
app.set("views", "./views");

//public folder
app.use(express.static("public"));

//routing
app.use("/auth", userRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
});
