var express = require('express')
var bcrypt = require("bcrypt-inzi")
var jwt = require('jsonwebtoken');
var { userModel, otpModel } = require('./../dbcon/modules')
var router = express.Router();
var SERVER_SECRET = process.env.SECRET || "1234";

router.post("/signup", (req, res, next) => {

    if (!req.body.name
        || !req.body.email
        || !req.body.password
        || !req.body.phone
        || !req.body.gender) {

        res.status(403).send(`
            please send name, email, passwod, phone and gender in json body.
            e.g:
            {
                "name": "Ahmer",
                "email": "skahmer@gmail.com",
                "password": "123",
                "phone": "03462858293",
                "gender": "Male"
            }`)
        return;
    }

    userModel.findOne({ email: req.body.email },
        function (err, doc) {
            if (!err && !doc) {

                bcrypt.stringToHash(req.body.password).then(function (hash) {

                    var newUser = new userModel({
                        "name": req.body.name,
                        "email": req.body.email,
                        "password": hash,
                        "phone": req.body.phone,
                        "gender": req.body.gender,
                    })
                    newUser.save((err, data) => {
                        if (!err) {
                            res.send({
                                status: 200,
                                message: "user created"
                            })
                        } else {
                            console.log(err);
                            res.status(500).send({
                                message: "user create error, " + err
                            })
                        }
                    });
                })

            } else if (err) {
                res.status(500).send({
                    message: "db error"
                })
            } else {
                res.send({
                    message: "user already exist"
                })
            }
        })

})


router.post("/login", (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        res.send({
            message: `please send email and passwod in json body.
            e.g:
            {
                "email": "kb337137@gmail.com",
                "password": "abc",
            }`,
            status: 403
        });
        return
    }
    userModel.findOne({ email: req.body.email }, function (err, user) {

        if (err) {
            res.send({
                message: "An Error Occure :" + JSON.stringify(err),
                status: 500
            });
        }
        else if (user) {

            bcrypt.varifyHash(req.body.password, user.password).then(isMatched => {
                if (isMatched) {
                    console.log("Matched");

                    var token = jwt.sign({
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        gender: user.gender
                    }, SERVER_SECRET);

                    res.cookie('jToken', token, {
                        maxAge: 86_400_000,
                        httpOnly: true
                    });

                    // when making request from frontend:
                    // var xhr = new XMLHttpRequest();
                    // xhr.open('GET', 'http://example.com/', true);
                    // xhr.withCredentials = true;
                    // xhr.send(null);


                    res.send({
                        message: "Login Success",
                        user: {
                            name: user.uname,
                            email: user.email,
                            phone: user.phone,
                            gender: user.gender,

                        },
                        status: 200
                    });

                } else {
                    console.log("not matched");
                    res.send({
                        message: "inncorrect Password",
                        status: 401
                    })
                }
            }).catch(e => {
                console.log("error: ", e)
            });
        } else {
            res.send({
                message: "User NOT Found",
                status: 403
            });
        }
    });
})


// router.post("/login", (req, res, next) => {

//     if (!req.body.email || !req.body.password) {

//         res.status(403).send(`
//             please send email and passwod in json body.
//             e.g:
//             {
//                 "email": "skahmer@gmail.com",
//                 "password": "123",
//             }`)
//         return;
//     }

//     userModel.findOne({ email: req.body.email },
//         function (err, user) {
//             if (err) {
//                 res.status(500).send({
//                     message: "an error occured: " + JSON.stringify(err)
//                 });
//             } else if (user) {

//                 bcrypt.varifyHash(req.body.password, user.password).then(isMatched => {
//                     if (isMatched) {
//                         console.log("matched");

//                         var token =
//                             jwt.sign({
//                                 id: user._id,
//                                 name: user.name,
//                                 email: user.email,
//                             }, SERVER_SECRET)

//                         res.cookie('jToken', token, {
//                             maxAge: 86_400_000,
//                             httpOnly: true
//                         });

//                         res.send({
//                             message: "login success",
//                             user: {
//                                 name: user.name,
//                                 email: user.email,
//                                 phone: user.phone,
//                                 gender: user.gender,
//                             }
//                         });

//                     } else {
//                         console.log("not matched");
//                         res.status(401).send({
//                             message: "incorrect password"
//                         })
//                     }
//                 }).catch(e => {
//                     console.log("error: ", e)
//                 })

//             } else {
//                 res.status(403).send({
//                     message: "user not found"
//                 });
//             }
//         });
// })
router.post("/logout", (req, res, next) => {
    res.clearCookie('jToken')

    res.send("logout success");
})
module.exports = router;