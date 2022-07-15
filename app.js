const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
app.set('view engine','ejs')

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/logDB",{ useNewUrlParser:true});
const roleschema = mongoose.Schema({
    name:String
});

const rolemodel = mongoose.model('rolemodel',roleschema,'item');

const i1 = new rolemodel({name:"admin"});
const i2 = new rolemodel({name:"manager"});
const i3 = new rolemodel({name:"client"});
const di = [i1,i2,i3];

const personschema = ({username:String,password:String,role:[roleschema]});
const personmodel = mongoose.model('personmodel',personschema,'person');
app.get('/',function(req,res)
{
    res.render("home");
})
app.get("/register",function(req,res)
{
    res.render("register") 
});

app.post("/register",function(req,res)
{
    const name = req.body.email;
    const ps = req.body.password;
    const role = req.body.role;
    
    const rsc = rolemodel({name:role});
    const t = personmodel({username:name,password:ps,role:rsc});
    t.save();
    rsc.save();
    res.send("done");
    
});
app.post("/login",function(req,res)
{
    const name = req.body.email;
    const ps = req.body.password;
    const role = req.body.role;
    
    personmodel.findOne({username:name},function(err,user)
    {
        if(err)
        {
            console.log(err);
        }
        else if(user)
        {
            personmodel.findOne({username:name,password:ps},function(err,authuser)
            {
                if(err)
                {
                    console.log(err);
                }
                else if(authuser)
                {
                    rolemodel.findOne({name:role},function(err)
                    {
                        if(err)
                        {
                            console.log(err)
                        }
                        else
                        {
                            console.log("found");
                        }
                    })}
                    else
                    {
                        console.log("password dose not match");
                    }
            })
        }
        else
        {
            console.log("user dose not exist");
        }
    })
    
});

app.get("/login",function(req,res)
{
    res.render("login") 
});

app.listen('3000', function()
{
    console.log("Server Running At Port : 3000")
})