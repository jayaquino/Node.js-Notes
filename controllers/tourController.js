const { response } = require('../app');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utilities/apiFeatures');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const factory = require('./handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  // Pre-fills the query string so the user does not have to do it.
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields =
    'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price'
    });
  }
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // The QueryObject only executes when awaited on
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate(
    'reviews'
  );

  if (!tour) {
    next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!tour) {
    next(new AppError('No tour found with that ID', 404));
  }

  response.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
});

exports.deleteTour = factory.deleteOne(Tour);

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) {
//     return next(
//       new AppError('No tour found with that ID', 404)
//     );
//   }

//   res.status(204).json({
//     status: 'success',
//     tour: null
//   });
// });

exports.getTourStats = catchAsync(
  async (req, res, next) => {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: { $gte: 4.5 }
        }
      },
      {
        $group: {
          _id: {
            $toUpper: '$difficulty'
          },
          numTours: { $sum: 1 },
          numRatings: {
            $sum: '$ratingsQuantity'
          },
          avgRating: {
            $avg: '$ratingsAverage'
          },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 } // 1 for ascending
      },
      {
        $match: {
          _id: { $ne: 'EASY' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      stats
    });
  }
);

exports.getMonthlyPlan = catchAsync(
  async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates' // deconstructs an array and outputs one document per element in array
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
  }
);
