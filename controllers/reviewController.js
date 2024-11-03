const Review = require('../models/reviewModel');
const catchAsync = require('../utilities/catchAsync');
const APIFeatures = require('../utilities/apiFeatures');

exports.checkBody = (req, res, next) => {
  if (
    !req.body.review ||
    !req.body.tour ||
    !req.body.user
  ) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing review, tour, or user'
    });
  }
  next();
};

exports.getAllReviews = catchAsync(
  async (req, res, next) => {
    const features = new APIFeatures(
      Review.find(),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const reviews = await features.query;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: reviews.length,
      data: {
        reviews
      }
    });
  }
);

exports.createReview = catchAsync(
  async (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user.id;

    const newReview = await Review.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newReview
      }
    });
  }
);
