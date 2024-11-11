const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const AppError = require('./utilities/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.options('*', cors());

// MIDDLEWARE
// Set security HTTP headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [
        "'self'",
        'https://*.mapbox.com',
        'https://*.stripe.com'
      ],
      connectSrc: [
        "'self'",
        'http://127.0.0.1:3000',
        'ws://localhost:63186/',
        'ws://localhost:51809/'
      ],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      imgSrc: ["'self'", 'https://www.gstatic.com'],
      scriptSrc: [
        "'self'",
        'https://*.stripe.com',
        'https://cdnjs.cloudflare.com',
        'https://api.mapbox.com',
        'https://js.stripe.com',
        "'blob'"
      ],
      frameSrc: ["'self'", 'https://*.stripe.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  })
);
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
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS, clean input from html code. Injected html code with js code.
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Test middleware
app.use((req, res, next) => {
  console.log(req.cookies);
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

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
