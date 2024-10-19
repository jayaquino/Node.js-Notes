const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' }); // Reading environment variables must come before launching the app

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then((connection) => {
    console.log(connection.connections);
    console.log('DB connection successful');
  });
const app = require('./app');

console.log(process.env);

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// TEST
