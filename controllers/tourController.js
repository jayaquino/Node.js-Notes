const Tour = require('./../models/tourModel');

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

exports.getAllTours = (
  request,
  response,
) => {
  response.status(200).json({
    status: 'success',
    requestedAt: request.requestTime,
    // results: tours.length,
    // data: {
    //   tours,
    // },
  });
};

exports.getTour = (
  request,
  response,
) => {
  response.status(200).json({
    status: 'success',
    // data: {
    //   tour,
    // },
  });
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

exports.updateTour = (
  request,
  response,
) => {
  response.status(200).json({
    status: 'success',
    tour: 'Updated tour here',
  });
};

exports.deleteTour = (
  request,
  response,
) => {
  response.status(204).json({
    status: 'success',
    tour: null,
  });
};
