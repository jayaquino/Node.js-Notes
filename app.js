const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const AppError = require('./utilities/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARE
// Set security HTTP headers
app.use(helmet());

// Development logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Allows 100 request in 1 hr
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'Too many requests form this IP, please try again in an hour'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Test middleware
app.use((request, response, next) => {
  console.log('Hello Middleware');
  next();
});
app.use((request, response, next) => {
  request.requestTime = new Date().toISOString();
  next();
});
/*
app.get('/', (request, response) => {
  response
    .status(200)
    .json({ message: 'Hellow from the server', app: 'Natours' });
});

app.post('/', (request, response) => {
  response.send('You can post here');
});
*/

// ROUTE HANDLERS

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// If all other routes are not matched, it will his this route.
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl}`
  // });
  next(
    new AppError(
      `Can't find${req.originalUrl} on this server!`
    )
  );
});

app.use(globalErrorHandler);

module.exports = app;
