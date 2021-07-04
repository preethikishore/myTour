/*eslint-env node*/
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./index');
dotenv.config({path:'./config.env'});
const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASS);
mongoose.connect(DB,{
    useNewUrlParser : true,
    useCreateIndex : true,
    useFindAndModify : false,
    useUnifiedTopology: true 
}).then(()=>{console.log('connect Successfully');});



const port = 3000;
app.listen(port,()=>
{
    console.log(`Server is Starting ${port}`);
})
