/*eslint-env node*/
const mongoose = require('mongoose');
// const validator = require('validator');
const tourSchema = new mongoose.Schema(
    {
        name : 
        {
            type : String,
            required : [true,'A Tour must a name'],
            unique: true,
            // validate : [validator.isAlpha , 'Tour name should contain only characters']
        },
        duration : 
        {
            type : Number,
            required : [true,'A Tour must a duration'],
           
        },
        maxGroupSize : 
        {
            type : Number,
            required : [true,'A Tour must a groupSize'],
           
        },
        difficulty : 
        {
            type : String,
            required : [true,'A Tour must a difficulty Level'],
            enum : {
              values :  ['easy' , 'medium' , 'difficult'],
              message : 'Difficulty is either easy , medium , difficult'
            } 
           
        },
        ratingAverage : 
        {
            type : Number,
            default : 4.5,
            min:[1 , 'A rating must be above 1.0'],
            max :[5 , 'A rating must not greater than 5.0']
           
        },
        ratingQuantity : 
        {
            type : Number,
           default:0
        },
        price :
        {
            type: Number,
            required:[true,'A Tour Must have price']
        },
        priceDiscount: 
        {
           type : Number,
           validate:
           {
               validator: function(val)
               {
                   return val < this.price
               },
               message:'The discount price ({VALUE}) should be less than regular price '
           }
        },
        summary:
        {
           type: String,
           trim:true,
           required : [true,'Tour must have a description']
        },
        imageCover:
        {
            type:String,
            required : [true,'Tour must have a image']
        },
        images:[String],
        createdAt :
        {
           type : Date,
           default : Date.now()
        },
        startDates : [Date],
        select:false
    })


const Tour = mongoose.model('Tour' , tourSchema);
module.exports = Tour;