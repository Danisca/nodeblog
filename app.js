const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
//path node's module The Path module provides a way of working with directories and file paths.
//var path = require('path');
const content = require(__dirname + "/content.js");
const app = express();

const articles = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine' , 'ejs');
//app.set("views",path.join(__dirname,'views'));

app.get("/",function(req,res){    
    res.render('home',{content: content.homeContent,articles: articles});
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

app.get("/show/:articleTitle",function(req,res){
    let article = new content.articles();
    article.title = _.lowerCase(req.params.articleTitle);
    /* console.log(article); */

    articles.every(function(element) {
        //this variable result is used for store the value of element 'cause when lodash is used the value is changed
        let result = element;
        if (_.lowerCase(element.title) === article.title){
            //this article = element is 'cause when the title matchs with element's title the element object is 
            //put into article variable to send it back to the user 
            article = result;
            return false;  
        } 
        else return true
    });
    res.render("showArticle",{article: article});
});

app.post("/compose",function(req,res){
   let newArticle = new content.articles(req.body.articleTitle,req.body.articleBody);
   //console.log(newArticle);
   articles.push(newArticle);
   res.redirect("/"); 
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
