const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config")

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// view engine
app.set('view engine', 'ejs');

// static file
app.use(express.static("public"));

app.get('/', (req, res)=>{
    res.render("login");
});

app.get('/signup', (req, res)=>{
    res.render("signup");
});

// Register user
app.post("/signup", async(req, res)=>{
    const data = {
        name : req.body.username,
        password : req.body.password
    }

    // check for existing user
    const existingUser = await collection.findOne({name:data.name});
    if(existingUser){
        res.send("Username already exixt. Try another username");
        console.log("Username already exixt. Try another username");

    } else{
        // password hasing

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword; // replace plain pwd with hashed pwd

        const userdata  = await collection.insertMany(data);
        console.log(userdata);
    }
});

// Login user
app.post('/login', async(req, res)=>{
    try{
        const check = await collection.findOne({name:req.body.username});

        if(!check){
            res.send("user cannot find");
        }

        // if found: compare hash password with plain password user inputs
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);

        if(isPasswordMatch){
            res.render("home");
        } else {
            req.send("Wrong credentials");
        }
    } catch {
        res.send("Wrong credentials");
    }
})


const PORT = 5000;
app.listen(PORT, ()=>{
    console.log("Server running at ", PORT);
})