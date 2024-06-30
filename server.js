const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((connection) => {
    console.log(connection.connections);
    console.log(
      'DB connection successful',
    );
  });
const app = require('./app');

console.log(process.env);

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [
      true,
      'A tour must have a name',
    ],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [
      true,
      'A tour must have a price',
    ],
  },
});

const Tour = mongoose.model(
  'Tour',
  tourSchema,
);

const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.7,
  price: 497,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((error) => {
    console.log('ERROR', error);
  });

const port = process.env.PORT;
app.listen(port, () => {
  console.log(
    `App running on port ${port}`,
  );
});
