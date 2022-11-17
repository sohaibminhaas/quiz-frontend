const express = require("express");
var router = express.Router();
const axios = require("axios");

router.get("/", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    const data = Object.assign(req.body);
    axios
        .post(process.env.BASEURL + "/register",
            { firstName: data.firstName, lastName: data.lastName, email: data.email, password: data.password, },
            { "Content-Type": "application/json", })
        .then((response) => {
            if(response.data.status){
                res.send({ isRegister: true });
            }else{
                res.send({ isRegister: false });
            }
        })
        .catch((error) => {
            console.log("error===========", error)
            res.send({ isRegister: false });
        });
});

router.get("/home", (req, res) => {
    if (req.session.user) {
        console.log("eq.session.user=====", req.session.user)
        axios.get(process.env.BASEURL + `/user/quizzes` , { "Content-Type": "application/json", })
            .then((allQuizes) => {
                axios.get(process.env.BASEURL + `/quiz/attempts/${req.session.user.id}` , { "Content-Type": "application/json", })
                .then((allAttempts) => {
                    res.render("home", {
                        data: allQuizes.data.data,
                        attempts: allAttempts.data.data,
                        name: req.session.user.firstName + " " + req.session.user.lastName,
                    });
                })
                .catch((error) => {
                    console.log("error===========", error)
                    res.render("home", {
                        data: undefined,
                        attempts: undefined,
                        name: req.session.user.firstName + " " + req.session.user.lastName,
                    });
                });
            })
            .catch((error) => {
                console.log("error===========", error)
                res.render("home", {
                    data: undefined,
                    attempts: undefined,
                    name: req.session.user.firstName + " " + req.session.user.lastName,
                });
            });
    } else {
        res.redirect('/')
    }
});

router.post("/login", (req, res) => {
    const data = Object.assign(req.body);
    axios
        .post(process.env.BASEURL + "/login",
            { email: data.email, password: data.password, },
            { "Content-Type": "application/json", })
        .then((response) => {
            if(response.data.status){
                req.session.user = response.data.data;
                req.session.save();
                res.send({ authenticated: true });
            }else{
                res.send({ authenticated: false });
            }
        })
        .catch((error) => {
            console.log("error===========", error)
            res.send({ authenticated: false });
        });
});

router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect('/')
});

router.get("/quiz/create", (req, res) => {
    if(req.session.user){
        res.render("quiz", {
            name: req.session.user.firstName + " " + req.session.user.lastName,
        });
    }else{
        res.redirect('/')
    }
});

router.post("/quiz/create", (req, res) => {
    if (req.session.user) {
        const data = Object.assign(req.body);
        const postedData = {...data, userId: req.session.user.id}
        axios
            .post(process.env.BASEURL + "/quiz/create", postedData, { "Content-Type": "application/json", })
            .then((response) => {
                if (response.data.status) {
                    res.send({ quizCreated: true });
                } else {
                    res.send({ quizCreated: false });
                }
            })
            .catch((error) => {
                console.log("error===========", error)
                res.send({ quizCreated: false });
            });
    } else {
        res.redirect('/')
    }
});

router.get("/quiz/:id", (req, res) => {
    if (req.session.user) {
        let quizId = req.params.id;
        axios.get(process.env.BASEURL + `/quiz/${quizId}`, { "Content-Type": "application/json", })
            .then((response) => {
                res.render("list-quiz",{
                    data: response.data.data,
                    name: req.session.user.firstName + " " + req.session.user.lastName,
                });
            })
            .catch((error) => {
                console.log("error===========", error)
                res.render("list-quiz",{
                    data: undefined
                });
            });
    } else {
        res.redirect('/')
    }
});

router.post("/quiz/attempt", (req, res) => {
    if (req.session.user) {
        const data = Object.assign(req.body);
        var postedData = {...data, userId: req.session.user.id};
        axios.post(process.env.BASEURL + `/quiz/attempt`, postedData, { "Content-Type": "application/json", })
            .then((response) => {
                console.log("response================", response);
                if (response.data.status) {
                    res.send({ quizAttempted: true });
                } else {
                    res.send({ quizAttempted: false });
                }
            })
            .catch((error) => {
                console.log("error===========", error)
                res.send({ quizAttempted: false });
            });
    } else {
        res.redirect('/')
    }
});



module.exports = router;