var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

var userSchema = new Schema ({
    "email": {
        type: String,
        unique: true
    },
    "password": String
});

let User;
var uri = "mongodb+srv://dbUser:dbUserPassword@senecaweb.8lfwkyg.mongodb.net/?retryWrites=true&w=majority";

exports.startDB = function(){
    return new Promise(function(resolve,reject){
        let db = mongoose.createConnection(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function(error){
            if(error) {
                console.log("Cannot connect to DB");
                reject(error);
            }
            else {
                console.log("DB connection successful.");
                User = db.model("finalUsers", userSchema);    
                resolve();
            }
        }); 

    });
}

exports.register = function(user){
    return new Promise(function(resolve,reject){
        if (user.password.trim().length == 0 || user.email.trim().length == 0)
        reject("Error: email or password cannot be empty");
        else {
            bcrypt.hash(user.password, 10).then(hash=>{
                user.password = hash;
                let newUser = new User(user);
                newUser.save().then(()=>{
                    resolve();
                }).catch((err)=>{
                    if (err.code === 11000) reject("Error " + user.email + " already exists");
                    else reject("Error: cannot create the user");
                })
            })
        }
    });
}

exports.signIn = function(user){
    return new Promise(function(resolve,reject){
        User.findOne({"email": user.email}).lean().exec().then((foundUser)=>{
            if (!foundUser) reject("Cannot find the user: " + user.email);
            else{
                bcrypt.compare(user.password, foundUser.password).then((res)=>{
                    if (res === false)
                        reject("Incorrect password for user " + user.email);
                    else 
                        resolve(foundUser);
                })
            }

        })

    });
}