/*eslint-env node*/
const express = require('express');
const {protect,restrictTo} =  require('../Controller/authController');
const { getAllTour,createTour,getTour,
    updateTour,
    deleteTour,
    getAlisaTopTour,
    getTourStat,
    getmonthlyPlan,
     } = require('../Controller/tourController');
const router = express.Router();
router.route('/top-cheap-5').get(getAlisaTopTour,getAllTour);
router.route('/tourStat').get(getTourStat);

router.route('/monthlyPlan/:year').get(getmonthlyPlan);
router.route('/').
get(protect,getAllTour).
// post(checkBody,createTour);
post(createTour);
router.route('/:id').
get(getTour).
patch(updateTour).
 delete(protect,restrictTo('admin','guide'),deleteTour);
 //

module.exports = router;