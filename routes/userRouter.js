const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth")
const User = require("../models/userModel");
const Todo = require('../models/todoModel');
const Calories = require('../models/caloriesModel')

router.post("/register", async(req, res) => {
    try{
    let {email, password, passwordCheck, displayName} = req.body

    if(!email || !password || !passwordCheck){
        return res.status(400).json({msg: "Not all fields have been entered."});
    }
    if(password.length < 7){
        return res.status(400).json({msg: "The password must be at least 7 characters"});
    }
    if(password !== passwordCheck){
        return  res.status(400).json({msg: "Enter the same password twice for verification"});
    }
    const existingUser = await User.findOne({email: email})
    if(existingUser)
        return  res.status(400).json({msg: "Account with this email already exists"});

    if (!displayName) displayName = email;    

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt)

    const newUser = new User({
        email: email,
        password: passwordHash,
        displayName
    })

    const savedUser = await newUser.save();
    res.json(savedUser)
    console.log(savedUser);
    

} catch(err) {
    res.status(500).json({err: err.message})
}
});

router.post("/login", async (req, res) =>{
    try{
        let {emailLogin, passwordLogin} = req.body;

        if(!emailLogin || !passwordLogin) {
            return res.status(400).json({msg: "Not all fields have been entered."})
        }
        const user = await User.findOne({email: emailLogin})
        if(!user){
            return res.status(400).json({msg: "Not account with this user has been registred"})
        }
        const ifMatch = await bcrypt.compare(passwordLogin, user.password);
        if(!ifMatch){
            return res.status(400).json({msg: "Invalid cradentials"})
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
        res.json({
            token,
            user:{
                id: user._id,
                displayName: user.displayName
            }
        })
    }catch(err){
        res.status(500).json({err: err.message});
    }
})

router.delete("/delete", auth, async (req, res) => {
    try{
        const deleteUser = await User.findByIdAndDelete(req.user)
        res.json(deleteUser)
    }catch(err){
        res.status(500).json({err: err.message})
    }
})

router.post("/tokenIsValid", async (req,res) => {
    try{
        const token = req.header("x-auth-token");
        if(!token){
            return res.json(false)
        }

        const verified = jwt.verify(token,process.env.JWT_SECRET)
        if(!verified){
            return res.json(false)
        }
        const user = await User.findById(verified.id);
        if(!user){
            return res.json(false)
        }

        return res.json(true)
    }catch(err){
        res.status(500).json({err: err.message})
    }
})

router.get("/", auth, async (req,res) => {
    const user = await User.findById(req.user)
    res.json({
        displayName: user.displayName,
        id: user._id
    })
})


router.get('/todos', (req, res, next) => {
    Todo.find({}, 'action')
        .then(data => res.json(data))
        .catch(next)
});

router.post('/todos', (req, res, next) => {
    if(req.body.action){
        Todo.create(req.body)
            .then(data => res.json(data))
            .catch(next)
    }else{
        res.json({
            error: "The input field is empty"
        })
    }
});

router.delete('/todos/:id', (req, res, next) => {
    Todo.findByIdAndDelete({"_id": req.params.id})
        .then(data => res.json(data))
        .catch(next)
})



router.get('/calories', (req, res, next) => {
    Calories.find({}, 'food foodCalories caloriesLeft')
        .then(data => res.json(data))
        .catch(next)
});

router.post('/calories', (req, res, next) => {
    if(req.body.food){
        Calories.create(req.body)
            .then(data => res.json(data))
            .catch(next)
    }else{
        res.json({
            error: "The input field is empty"
        })
    }
});

router.delete('/calories/delete', (req, res, next) => {
    Calories.remove({})
        .then(data => res.json(data))
        .catch(next)
})
module.exports = router