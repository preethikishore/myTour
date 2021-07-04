/*eslint-env node*/
const { promisify } = require('util');
const User = require('./../Models/userModel');
const jwt = require('jsonwebtoken');
const sentEmail = require('./../utils/email');
const crypto = require('crypto');



let tokenSign = id =>
{
  return  jwt.sign({id : id} , process.env.JWT_SECRET , 
    { expiresIn: process.env.JWT_EXPIRE} );
}
exports.signUp = async (req,res)=>
{
     try{
        const newUser = await User.create(req.body);
    //  name : req.body.name,
    //  email : req.body.email,
    //  password : req.body.password,
    //  confpassword : req.body.confpassword,
    //  passwordChange : req.body.passwordChange
        const token =  tokenSign(newUser._id);
        res.status(200).json(
            {
                message : 'Success' ,
                token,
                data :
                {
                  user : newUser
                } 
            })
        }
        catch(err)
        {
            console.log(err);
            res.status(400).json(
                {
                    message:err
                })
            }
        }
    

   
   exports.login = async(req,res)=>
   {
       try
       {
         const email = req.body.email;
         const password = req.body.password;
         if(!email || !password)
         {
             //app error
              return res.status(400).json(
                 {
                     message:'Bad request email password not exist'
                 }
             )
         }

         const user = await User.findOne({email}).select('+password');
         console.log(user);
        //  const checkpass = await user.comparePassword(password,user.password);
        //  console.log(checkpass);
         if(!user || !(await user.comparePassword(password,user.password)))
         {
            return res.status(400).json(
                {
                    message:'Email / Password Incorrect'
                }
            ) 
         }
         const token = tokenSign(user._id);
         res.status(200).json({
             status:'Success' ,
             token
         });
       }
       catch(err)
       {
           res.status(400).json({
               message : err
           })
       }
   }

exports.protect = async(req,res,next)=>
{
    try{
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        {
            token = req.headers.authorization.split(' ')[1];
          
           
        } 
       
        if(!token)
        {
           
            return res.status(400).json({
                message:'you are not Logged In'
            })
           
        }
        //token verification
        const decodetoken = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
        // console.log(decodetoken);
        //user still exist
        const existuser = await User.findById(decodetoken.id);
 
        if(!existuser)
        {
            return next(
                res.status(400).json({
                message:'The user belonging to this token does not exist'
            })
            );
         
           
        }
        //check user change password
          if(existuser.passwordChange(decodetoken.iat)){
            return  res.status(400).json({
                message:'The Password recently changed Please Login Again'
            });
           
          }

       req.user = existuser; 
    }
    catch(err)
    {
        res.status(400).json({
            message : err
        })
    }
    next();
}
exports.restrictTo = (...roles)=>
{
    return (req,res, next)=>{
        if(!roles.includes(req.user.role))
        {
            return res.status(400).json({
                message : 'Not authorized to perform this action'
            })
        }
        next()
    }
}

exports.forgetPassword = async (req,res,next)=>
{
    try
    {
  // get the user with email
  const user = await User.findOne({email : req.body.email});
  if(!user)
  {
      return res.status(400).json({
        message : 'please provide valid email '
    })
  }
   // generate rest token
   const resetToken = user.createPasswordToken();
   //validateBeforeSave function helps temporarly remove the current validation
   await user.save({ validateBeforeSave : false});
   console.log(resetToken);

   const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;
   const message = `Forgot your password? please use this link to reset password ${resetURL}`;
  try
  {
   await sentEmail({
              email:user.email,
              subject:'Forget Password',
              message
       })
       res.status(200).json({
           status:'Success',
           message:'Token sent to Email'
       })
  }catch(err)
  {
     user.passwordResetToken = undefined;
     user.passwordResetExpire = undefined;
     await user.save({ validateBeforeSave : false});
  }

}
 catch(err)
 {
    return res.status(400).json({
        message : err
    }) 
 }
  next()
}
exports.resetPassword = async (req,res,next)=>
{
  try
  {
       const hashedToken = crypto
                   .createHash('sha256')
                   .update(req.params.token)
                   .digest('hex');
        const user = await User.findOne(
            {
                passwordResetToken : hashedToken,
                passwordResetExpire : {$gt : Date.now()}
            });
            if(!user)
            {
               return res.status(400).json({
                    message : 'Token is invalid or  expired'
                }) 
            }
    user.password = req.body.password;
    user.confpassword = req.body.confpassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();
   
    const token = tokenSign (user._id);
    res.status(200).json({
        status : 'Success',
        token
    }) 

  }
  catch(err)
  {
      console.log(err)
      res.status(400).json({
          message : err
      })
  }
  next()
}

exports.updatePassword = async (req,res,next)=>
{
   try
   {
      //get the users
      const user = await User.findById(req.user._id).select('+password');
      if(!await(user.comparePassword(req.body.password,user.password)))
      {
        res.status(400).json({
            message : 'Entered password is not correct '
        })
      }

      user.password = req.body.password;
      user.confpassword = req.body.confpassword;
      await user.save();

   }
   catch(err)
   {
    res.status(400).json({
        message : err
    }) 
   }
    next()
}