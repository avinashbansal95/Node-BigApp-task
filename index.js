const express    = require('express');
const jwt        = require('jsonwebtoken');
const app        = express();
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
let userRoutes   = require('./api/routes/users');


//Using mlab for mongodb
mongoose.connect('mongodb://avinash:node123@ds145911.mlab.com:45911/node-task',{ useNewUrlParser: true });

//To parse urlencoded data with extended bodies
app.use(bodyParser.urlencoded({extended : false}));

//To parse json data
app.use(bodyParser.json());
//Making use of our user route
app.use(userRoutes);

//If request is sent to unlegitimate path,this will throw an error
app.use((req, res, next) =>
{
    const error = new Error("Path Not found");
    error.status = 404;
    next(error);
})


//whenever error is thrown from anywhere in our application, this middleware make use of that
app.use((error, req, res, next) =>
{
    res.status(error.status || 500);
    res.json({
        error :{
            message : error.message
        }
    });
});

app.listen(4000,() =>
{
    console.log("Server has started..");
})