/*eslint-env node*/

const Tour = require("./../Models/TourModel");
const APIFeatures = require('../utils/utils');
exports.getAlisaTopTour = (req,res,next)=>
{
    req.this.query.limit = '5';
    req.this.query.sort = '-ratingAverage.price';
    req.this.query.feilds= 'name,price,difficulty';
    next();
}

exports.getAllTour = async (req,res)=>
{
   try
   {   
    const features = new APIFeatures(Tour.find(),req.query)
    .filter()
    .sort()
    .limit()
    .pagination();
    const tours = await features.query;
    res.status(200)
    .json({
            message : 'Success',
            total : tours.length,
            data :{tours}
            
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
  
};

exports.getTour = async (req,res)=>
{
    try
    {
        const tour = await Tour.findById(req.params.id);
        //Tour.findOne({_id : req.params.id})
        res.status(200)
        .json({
                message : 'Success',
                data :{tours : tour}
                
            })
    }catch(err)
    {
        console.log(err);
       res.status(400).json(
           {
               status : ' Fail'
           }
       )
    }
    
};
exports.createTour = async(req,res)=>
{

    // const newTour = new Tour({});
    // newTour.save();
    try{
    const newTour = await Tour.create(req.body);
    res.status(201).json(
        {
            message:"Success",
            data:{
              tour: newTour
            }
        })
    }catch (err){
        console.log(err);
       res.status(400).json({
           status:'Fail',
           message :err

       })
    }
    
    };

exports.updateTour = async (req,res) =>
{
    try
    {
        const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,
            {
              new : true,
              runValidators : true
            });
            res.status(200).json({
            message :'Success',
            data:
            {
                tour
            }
        })
    }catch(err)
    {
        console.log(err);
        res.status(400).json({
            status : 'fail'
        })
    }
   
};
exports.deleteTour = async (req,res) =>
{
    try
    {
         await Tour.findByIdAndDelete(req.params.id,req.body);
          
            res.status(200).json({
            message :'Success',
            
        })
    }catch(err)
    {
        console.log(err);
        res.status(400).json({
            status : 'fail'
        })
    }
   
};

exports.getTourStat = async(req,res) =>
{
    try{
        const tour_stat = await Tour.aggregate([
            {
                $match: {ratingAverage: {$gte : 4.5}}
            },
            {
                $group: {
                    _id : '$difficulty',
                    numTour : {$sum : 1},
                    avgRating : {$avg : '$ratingAverage'},
                    avgPrice : {$avg : '$price'},
                    minPrice : {$min : '$price'},
                    maxPrice : {$max : '$price'}
     
                }        
            },
            {
                $sort:  {avgPrice : 1}
            }

        ]);
        res.status(200).send({
            tour_stat
        })
    }
    catch(err)
    {
      console.log(err);
      res.status(400).json({
          message : 'Fail'
      })
    }
   
}

exports.getmonthlyPlan = async (req,res) => {  
    try{
      const year = req.params.year * 1;
      const plan =  await Tour.aggregate([
          { $unwind :'$startDates'},
            {
              $match : {
                  startDates :
                  {
                      $gte : new Date(`${year}/01/01`),
                      $lte : new Date(`${year}/12/31`)
                  } 
              }
            
            } ,
            {
              $group : {
                  _id: {$month : '$startDates'},
                  numTourStarted :{$sum : 1},
                  tourname :{$push :'$name'}
              }
            } ,
            {
                $project : {_id : 0}

            }
          
        ]);

        res.status(200).send({
           plan
        })
   }
   catch(err)
   {
    console.log(err);
    res.status(400).json({
        message : 'Fail'
    })
   }
}