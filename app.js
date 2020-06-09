require('dotenv').config()
const express = require("express"),
ejs = require("ejs"),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
app = express(),
encrypt = require('mongoose-encryption')



mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true})

const userSchema = new mongoose.Schema({
    email : String,
    password : String
})

var secret = 
userSchema.plugin(encrypt,{secret  : process.env.SECRET, encryptedFields :['password'] })


const User = mongoose.model('User', userSchema)

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get('/',function(req,res){
    res.render('home')
})


app.get('/register',function(req,res){
    res.render('register')
})

app.post('/register',function(req,res){
    
    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    })
    
    newUser.save(function(err){
        if(err){
            console.log(err)
        }else{
            res.render("secrets")
        }
    })

});


app.get('/login',function(req,res){
    res.render('login')
})
app.post('/login',function(req,res){
    const username = req.body.username,
          password = req.body.password;

    User.findOne({email: username}, function(err,foundUser){
        if(err){
            console.log(err)
        }else if(foundUser){
                if(foundUser.password === password){
                    console.log(foundUser + " " + password)
                res.render('secrets');
                }
                else{
                    console.log(foundUser + " " + password)

                    res.send("Wrong password")
                }
        }
    });

});





app.listen(3001,function(){
    console.log("Server running on port 3000")
});
