const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/blogApp",{ useNewUrlParser: true,useUnifiedTopology: true });
const _ = require("lodash");
//path node's module The Path module provides a way of working with directories and file paths.
//var path = require('path');
const content = require(__dirname + "/content.js");
const app = express();

//First create a Schema 
const  articlesSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true
        },
        body:{
            type: String,
            required: true
        }
    }
);
const ArticleModel = new mongoose.model("article",articlesSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine' , 'ejs');
//app.set("views",path.join(__dirname,'views'));

app.get("/",(req,res)=>{    
    ArticleModel.find((err,articles)=>{
        if(!err){
            res.render('home',{content: content.homeContent,articles: articles});
        }
    });
});

app.get("/about",function(req,res){
    res.render("about",{content: content.aboutContent})
});

app.get("/contact",function(req,res){
    res.render("contact",{content: content.contactContent});
});

app.get("/compose",function(req,res){
    res.render("compose");
});
//routing parameters examples /articles/:articleTitle

app.get("/show/:articleId",function(req,res){
    //article.title = _.lowerCase(req.params.articleTitle);
    const articleName = req.params.articleTitle;
    console.log(articleName);
    ArticleModel.findOne({
        id: req.params.articleTitle
    },(err,result)=>{
        //console.log(result);
        if(!err){
            res.render("showArticle",{result: result});
        }
    });
});

app.post("/compose",function(req,res){
    const title = _.lowerCase(req.body.articleTitle)
    const body = req.body.articleBody;
    //console.log(_.lowerCase(req.body.articleTitle));
   let newArticle = new ArticleModel({
       title: _.capitalize(title),
       body: body
    });
   newArticle.save((err)=>{
        if(!err){
            res.redirect("/"); 
        }else{
            res.redirect("/compose");
        }
   });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
  console.log("server running locally");
}
app.listen(port);
