var express = require('express');

var app = express();
var controller = require('./api/controller.js');
controller(app);

app.set('view engine', 'ejs');
app.use(express.static('assets'));


app.listen(3000, function () {
    console.log('Server started successfully');
});