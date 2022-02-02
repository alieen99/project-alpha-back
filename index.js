const mongoose = require("mongoose");
const debug = require("debug")("app:startup");
const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const Joi = require("joi");
const home = require("./routes/home");
const comments = require("./routes/comments");

const express = require("express");
const app = express();

require("./startup/prod")(app);

mongoose.connect("mongodb+srv://alieen99:alishad2020@project-alpha.hs72h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    .then(() => console.log("Connected to MongoDB ..."))
    .catch(err => console.error("Could not connect to MongoDB"));

const env = app.get("env");
console.log("Envoirement is set on : " + env);
app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

//Configuration
console.log("Application Name : " + config.get("name"));

if (env === "development") {
    app.use(morgan("tiny"));
    console.log("Morgan enabled ...")
}


app.use("/", home);
app.use("/api/comments", comments);

//configuring port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Lestening on port ${port} ...`));