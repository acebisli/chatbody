/**
 * Created by acebisli on 25/10/16.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('chat', { title: 'Express' });
});

module.exports = router;
