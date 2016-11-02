var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log("called get");
    res.render('index', { title: 'Express' });
});
router.post("/", function (req, res, next) {
    console.log("called post");
    var userName = req.body.txtUserName;
    if (userName != undefined && userName != "" && userName != "undefined") {
        res.cookie('userName', userName, { maxAge: 900000, httpOnly: true });
        res.redirect('/chat');
    }
    res.render('index');
});

module.exports = router;
