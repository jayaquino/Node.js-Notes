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

    // Get all tours
    // const tours = await Tour.find();

    // Advanced filtering using GTE, LTE, LT, and GT
    let queryStr =
      JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`, // g means it happens multiple times
    );

    // Filtering to get based on query params
    let query = Tour.find(
      JSON.parse(queryStr),
    );

    // SORTING
    if (request.query.sort) {
      // MULTI-VARIABLE SORTING
      const sortBy = request.query.sort
        .split(',')
        .join(' ');
      query = query.sort(sortBy);
    } else {
      // Good practice to default sorting by created at descending
      query = query.sort('-createdAt');
    }

    // FIELD LIMITING
    if (request.query.fields) {
      const fields =
        request.query.fields
          .split(',')
          .join(' ');
      query = query.select(fields);
      // query = query.select('name duration price') Express accepts this format
    } else {
      // MondoDB, '-' means exclude in select. This excludes the default mongodb variable
      query = query.select('-__v');
    }

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
