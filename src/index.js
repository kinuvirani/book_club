const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const { sequelize, models } = require('./models');
const bootFiles = require('./boot');
const logger = require('./logger');
const userRoute = require('./routes/user');
const bookRoute = require('./routes/book');
const bookmarkRoute = require('./routes/bookmark');
const ratingRoute = require('./routes/rating');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('common'));

app.use('/user', userRoute);
app.use('/book', bookRoute);
app.use('/bookmark', bookmarkRoute);
app.use('/rating', ratingRoute);

sequelize.sync().then(async () => {
  app.listen(process.env.PORT, () => {
    console.log(`Server started at http://localhost:${process.env.PORT}`);
  });

  // ON BOOT
  bootFiles(models);
  return '';
}).catch(error => {
  logger.error('SYNC ERROR>>', error);
  throw error;
});
