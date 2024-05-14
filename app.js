//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

mongoose.connect(process.env.ATLASLINK);

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = new mongoose.model("User", userSchema);

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/register", (req, res)=>{
    res.render("register");
});

app.post("/register",(req, res)=>{
    const {username: userName, password: password}=req.body;
    bcrypt.hash(password, saltRounds, (err, hash)=>{
        const newUser = new User({
            email: userName,
            password: hash
        });
        const data = newUser.save();
        try{
            if(data){
                res.render("login");
            }
        } catch(err){
            console.log(err);
        }
    })
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.post("/login", async(req, res)=>{
    const{username: userName, password: password}=req.body;
    const data = await User.findOne({email: userName});
    try{
        bcrypt.compare(password, data.password, (err, result)=>{
            if(result === true){
                res.render("secrets");
            } else {
                console.log("Wrong password");
            }
        })
    } catch(err){
        console.log(err);
    }
});

app.listen(4000, ()=>{
    console.log("Server is running on port 4000");
});