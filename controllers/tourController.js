const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(
    './dev-data/data/tours-simple.json',
  ),
);

exports.checkID = (
  request,
  response,
  next,
  value,
) => {
  if (value > tours.length) {
    return response.status(404).json({
      // return is important, otherwise it will continue running the function AND send the response
      status: 'fail',
      message: 'Invalid Id',
    });
  }
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

exports.getAllTours = (
  request,
  response,
) => {
  response.status(200).json({
    status: 'success',
    requestedAt: request.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

exports.getTour = (
  request,
  response,
) => {
  const id = request.params.id * 1;

  const tour = tours.find(
    (tour) => tour.id === id,
  );

  response.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (
  request,
  response,
) => {
  console.log(request.body);

  const newId =
    tours[tours.length - 1].id + 1;
  const newTour = Object.assign(
    { id: newId },
    request.body,
  );
  tours.push(newTour);

  fs.writeFile(
    './dev-data/data/tours-simple.json',
    JSON.stringify(tours),
    (error) => {
      response.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
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
