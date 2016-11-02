/**
 * Created by acebisli on 25/10/16.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    var userName = req.cookies.userName;
    if (userName) {
        userName = "olmad�";
    }
    res.render('chat', { userName: userName });
});

module.exports = router;
