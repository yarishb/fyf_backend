const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config()

//set up express

const app = express()
app.use(express.json())
app.use(cors())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`server has started on port: ${PORT}`);
})

//set up mongoose

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, 
    {useNewUrlParser: true, 
    useUnifiedTopology:true,
    useCreateIndex: true}, (err) => {
        if(err) throw err;
        console.log("MongoDB connection established");  
})

//set up routes

app.use("/", require("./routes/userRouter"))