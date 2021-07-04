const User = require("../Models/userModel");

/*eslint-env node*/
exports.getAllUser = async(req,res)=>
{
    try
    {   
     
     const users = await User.find();
     res.status(200)
     .json({
             message : 'Success',
             total : users.length,
             data :{users}
             
         })
    }
    catch(err)
    {
     console.log(err);
       res.status(404).json(
           {
               status: 'fail',
               message : err
               
           }
       )
    }
}
exports.getUser = (req,res)=>
{
    res.status(500).json({
            status:"Invalid",
            message:"Code Not Match"
        })
}
exports.updateUser = (req,res)=>
{
    res.status(500).json({
            status:"Invalid",
            message:"Code Not Match"
        })
}
exports.createUser = (req,res)=>
{
    res.status(500).json({
            status:"Invalid",
            message:"Code Not Match"
        })
}