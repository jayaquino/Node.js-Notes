const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utilities/apiFeatures');

exports.aliasTopTours = (
  request,
  response,
  next,
) => {
  // Pre-fills the query string so the user does not have to do it.
  request.query.limit = '5';
  request.query.sort =
    '-ratingsAverage,price';
  request.query.fields =
    'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.checkBody = (
  request,
  response,
  next,
) => {
  if (
    !request.body.name ||
    !request.body.price
  ) {
    return response.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

exports.getAllTours = async (
  request,
  response,
) => {
  try {
    // The QueryObject only executes when awaited on
    const features = new APIFeatures(
      Tour.find(),
      request.query,
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    response.status(200).json({
      status: 'success',
      requestedAt: request.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    response.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.getTour = async (
  request,
  response,
) => {
  try {
    const tour = await Tour.findById(
      request.params.id,
    );
    response.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    response.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.createTour = async (
  request,
  response,
) => {
  try {
    const newTour = await Tour.create(
      request.body,
    );

    response.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.updateTour = async (
  request,
  response,
) => {
  try {
    const tour =
      await Tour.findByIdAndUpdate(
        request.params.id,
        request.body,
        {
          new: true,
          runValidators: true,
        },
      );
    response.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};

exports.deleteTour = async (
  request,
  response,
) => {
  try {
    await Tour.findByIdAndDelete(
      request.params.id,
    );
    response.status(204).json({
      status: 'success',
      tour: null,
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};
