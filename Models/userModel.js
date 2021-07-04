/*eslint-env node*/
const mongoose = require('mongoose');
const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//name email password confpassword image
const userSchema = new mongoose.Schema(
    {
      name : {
          type : String ,
          required : [true ,'A valid user name  is mandatory']
      },
      email : {
        type : String ,
        required : [true ,'A valid email address is mandatory'],
        unique : true,
        validate: [validator.isEmail , 'Please provide a valid Email Address']
    },
    photo:String,
    role:
    {
        type:String,
        enum:['admin','user','guide'],
        default: 'user'


    },
    password : {
        type : String ,
        required :[true ,'Please provoide a password'],
        minlength : 8,
        select:false
    },
    confpassword : {
        type : String ,
        required :[true ,'Please Confirm Your password'],
       
        validate :
        {
            validator : function(el){ return el === this.password },
            message : 'Password are not same'
        }
    },
    passwordChangedAt : Date,
    passwordResetToken:String,
    passwordResetExpire:Date
    }
);


// pre middleware function that will execute before the function specified
userSchema.pre('save', async function(next)
{
  if(this.isModified('password')|| this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre('save',async function(next)
{
    if(!this.isModified('password')) return next();
    //use bcrypt  for encryption
  this.password = await bcrypt.hash(this.password , 12);
  this.confpassword = undefined;
})

// Instance methods that can call from any documents
userSchema.methods.comparePassword = async function(checkpassword,currentpassword)
{
    return await bcrypt.compare(checkpassword,currentpassword);
}
userSchema.methods.passwordChange = function(JWTTimestamp)
{
    let changeTimestamp;
    if(this.passwordChangedAt)
    {
      changeTimestamp = parseInt(this.passwordChangedAt.getTime()/1000);
      console.log(changeTimestamp,JWTTimestamp);
    }
    return JWTTimestamp < changeTimestamp ;
}

userSchema.methods.createPasswordToken = function ()
{
  const resetToken = crypto.randomBytes(32).toString('hex');
  //encryption
  this.passwordResetToken = crypto.createHash('sha256').
                            update(resetToken).digest('hex');
 console.log(resetToken , this.passwordResetToken);
  this.passwordResetExpire =  Date.now() + 10 * 60 * 1000;
  return resetToken;                          
}
const User = mongoose.model('User' ,userSchema);
module.exports = User;