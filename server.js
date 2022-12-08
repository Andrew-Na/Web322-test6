//https://cute-jade-anemone-boot.cyclic.app
var express = require("express");
var app = express();
var path = require("path");
var final = require("./final.js");
var HTTP_PORT = process.env.PORT || 8080;


app.use(express.json());
app.use(express.urlencoded({extended:true}));


function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

final.startDB().then(function(){
    app.listen(HTTP_PORT,onHttpStart);
}).catch((err)=>{
    console.log(err);
});

app.get("/",(req,res)=>{
    //res.render("home");
    res.sendFile(path.join(__dirname,"/finalViews/home.html"));
});

app.get("/register",(req,res)=>{
    res.sendFile(path.join(__dirname,"/finalViews/register.html"));
});

app.post("/register",(req,res)=>{
    final.register(req.body).then(()=>{
        var text = "";
        text += "<p>" + req.body.email + " registered successfully. <p>"
        text += '<br> <p><a href="/">Go Home</a></p>'
        res.send(text);
    }).catch((err)=>{
        res.send("<p>Error: " + err + "</p>");
    })
});

app.get("/signIn", (req,res)=>{
    res.sendFile(path.join(__dirname,"/finalViews/signIn.html"));
});

app.post("/signIn",(req,res)=>{
    final.signIn(req.body).then(()=>{
        var text = "";
        text += "<p>" + req.body.email + " signed in successfully. <p>"
        text += '<br> <p><a href="/">Go Home</a></p>'
        res.send(text);
    }).catch((err)=>{
        res.send(err);
    })
})
//get any other route that is not found
app.get("*",(req,res)=>{
    res.status(404).send("Not Found");
});