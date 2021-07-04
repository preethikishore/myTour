/*eslint-env node*/
const Tour = require("./../Models/TourModel");
class APIFeatures
    {
        constructor(query,queryString)
        {
           this.query = query;
           this.queryString = queryString; 
        }
        filter()
        {
            const queryObj = {...this.queryString};
            const excludedFeild = ['page', 'sort','feilds','limit'];
            excludedFeild.forEach((el)=>
            {      
                delete queryObj[el];
            });  
            let queryStr = JSON.stringify(queryObj);
            queryStr =  queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}`);
            Tour.find(JSON.parse(queryStr));
            return this;
        }

        sort()
        {
            if(this.queryString.sort)
            {
                const sortBy = this.queryString.sort.split(',').join(' ');
                this.query = this.query.sort(sortBy);
            }else{
                this.query = this.query.sort('-createdAt');
            }
            return this;
        }
        limit()
        {
            if(this.query.feilds)
            {
                const feilds = this.query.feilds.split(',').join(' ');
                this.query = this.query.select(feilds);
        
            }else{
                this.query = this.query.select('-__v');
            }
            return this;
        }
     pagination()
     {
        let page = this.queryString.page * 1 || 1;
        let limit = this.queryString.limit * 1 || 100;
        let skip = (page - 1 ) * limit;
        this.query = this.query.skip(skip).limit(limit);  
        return this;
     }

    }
module.exports = APIFeatures