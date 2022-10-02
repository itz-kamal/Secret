require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
	email: String,
	password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model("user", userSchema);

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/register", (req, res) => {
	res.render("register");
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.post("/register", (req, res) => {

	let newUser = new User({
		email: req.body.username,
		password: req.body.password
	});
	newUser.save((err) => {
		if (err) {
			console.log(err);
		} else {
			res.render("secrets");
		}
	});
});

app.post("/login", (req, res) => {

	let username = req.body.username;
	let password = req.body.password;

	User.findOne({email: username}, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			if (result) {
				if (result.password === password) {
					res.render("secrets");
				}
			}
		}
	});
});

app.listen(8888, () => {
	console.log("Server on 8888");
});