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

exports.getAllTours = async (
  request,
  response,
) => {
  try {
    // console.log(request.query); Gets all query parameters

    // Filtering Method 1:
    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy',
    // });

    // Filtering Method 2, Mongoose way:
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    const queryObj = {
      ...request.query,
    }; // Setting a new object based on another object is a reference. This uses destructuring to create another

    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields',
    ]; // Limits paging, sorting, limiting, and selecting specific fields

    // Delete excluded parameters
    excludedFields.forEach(
      (element) =>
        delete queryObj[element],
    );

    // Filtering to get based on query params
    const query = Tour.find(queryObj);

    // Get all tours
    // const tours = await Tour.find();

    // The QueryObject only executes when awaited on
    const tours = await query;

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
