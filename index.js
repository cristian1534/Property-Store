const express = require("express");
const userRoutes = require("./routes/user");
const db = require("./config/database");
const app = express();

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

//views
app.set("view engine", "pug");
app.set("views", "./views");

//public folder
app.use(express.static("public"));

//routing
app.use("/auth", userRoutes);

const port = 3000;

app.listen(port, () => {
  console.log(`Server running on PORT ${port}`);
});
