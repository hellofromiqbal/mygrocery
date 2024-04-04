const mongoose = require('mongoose');
const { dbHost, dbPort, dbName, runningPort } = require('../config/config');

const mongooseConnection = (app) => {
  mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`)
    .then(() => {
      console.log('Connected to MongoDb.');
      app.listen(runningPort, () => {
        console.log(`App is listening in port http://localhost:${runningPort}`);
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = mongooseConnection;