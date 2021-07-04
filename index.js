/*eslint-env node*/
const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./route/tourRouter.js');
const userRouter = require('./route/userRouter.js');
const app = express();
app.use(express.static(`${__dirname}/public`));

app.use(express.json());
app.use(morgan('dev'));
app.use((req,res,next)=>
{
    req.requestTime = new Date().toISOString();
    //console.log(req.headers);
    next();
})



app.use('/api/v1/users',userRouter);
app.use('/api/v1/tours',tourRouter);

module.exports = app
