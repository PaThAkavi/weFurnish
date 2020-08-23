var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var Furniture = require("./models/furnitures");
var Keys = require("./config/keys");
var seedDB = require("./seeds");

//to remove data from db
//seedDB();
//mongoose.connect("mongodb://localhost/wefurnish", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(Keys.mongodb.dbURL, function(){
    console.log("Connected to MongoDB");
}, {useNewUrlParser: true, useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(require("express-session")({
    secret: "This is a secret",
    resolve: false,
    saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.get('/', function(req, res){
    res.render("homepage");
});

app.get('/catalog', function(req, res){
    Furniture.find({}, function(err, allFurnitures){
        if(err){
            console.log(err);
        } else{
            res.render("catalog", {furnitures: allFurnitures});
        }
    });
});

app.post('/catalog', isLoggedIn, function(req, res){
    var name = req.body.name;
    var price = req.body.price;
    var image = "images/" + req.body.image;
    var newFurniture = {name: name, price: price, image: image};
    Furniture.create(newFurniture, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else{
            res.redirect("/catalog");
        }
    });
});

app.get('/catalog/new', isLoggedIn, function(req, res){
    res.render("new");
});

app.get('/checkout', function(req, res){
    res.render("checkout");
});

app.get('/about', function(req, res){
    res.render("about");
});

app.get('/thankyou', function(req, res){
    res.render("thankyou");
});

app.get('/summary', function(req, res){
    res.render("summary");
});

//Authentication
app.get('/login', function(req, res){
    res.render("login");
});

app.post("/login", function(req, res, next){
    passport.authenticate("local",
    {
      successRedirect: "/catalog",
      failureRedirect: "/login",
      failureFlash: true,
      successFlash: "Welcome back to weFurnish, " + req.body.username + "!"
    })(req, res);
});

app.get('/signup', function(req, res){
    res.render("signup");
});

app.post("/signup", function(req, res){
    var newUser = new User(
        {
            username: req.body.username,
            gender: req.body.gender,
            email: req.body.email,
            mobile: req.body.mobile
        });
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/signup");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to weFurnish, " + req.body.username + "!");
            res.redirect("/catalog");
        });
    });
});

app.get('/logout', function(req, res){
    req.logOut();
    req.flash("success", "Logged You Out Successfully!");
    res.redirect("/catalog");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You have to be LoggedIn to do that!");
    res.redirect("/login");
}

app.listen(8080, function(){
    console.log("The server has started...");
});