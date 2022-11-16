const express = require('express');
const port = 3001;
const path = require("path");
const mainController = require("./controllers/mainController.js");
const bodyparser = require("body-parser");
const env = require('dotenv').config();
const session = require("express-session");
const Handlebars = require("handlebars");

const app = express();
app.use(
    bodyparser.urlencoded({
        extended: true,
    })
);
app.use(bodyparser.json());

app.use(
    session({
        name: "codeil",
        secret: "quizapp",
        resave: false,
        saveUninitialized: true,
    })
);

const { engine } = require('express-handlebars');
app.set("views", path.join(__dirname, "/views/"));
app.engine(
    "hbs",
    engine({
        extname: "hbs",
        defaultLayout: "index",
        layoutsDir: __dirname + "/views/layouts/",
        partialsDir: __dirname + "/views/partials/",
    })
);
app.set("view engine", "hbs");

app.use('/', mainController);

app.use(express.static(__dirname + "/public"));

app.listen(port, () => console.log(`App listening to port ${port}`));


Handlebars.registerHelper("Percentage", function (score, totalScore) {
    if(parseInt(score) == 0 && parseInt(totalScore) == 0){
        return 0;
    }else{
        return (parseInt(score) / parseInt(totalScore) ) * 100;;
    }
});