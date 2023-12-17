const mongoose = require('mongoose');
const express = require('express');

const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');

const cron = require('node-cron');
const moment = require('moment-timezone');
const turkeyTimezone = 'Europe/Istanbul';

const adminRoutes = require('./routes/admin');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  next();
});

app.use(adminRoutes);

app.use(errorController.get404);

const sendReminder = (cronExpression, url, timezone) => {
  cron.schedule(
    cronExpression,
    async () => {
      const currentTime = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');

      try {
        const response = await axios.get(url);

        console.log(
          `[${currentTime}] HTTP Request Successful. Response:`,
          response.data
        );
      } catch (error) {
        console.error(
          `[${currentTime}] Error during HTTP Request:`,
          error.message
        );
      }
    },
    {
      scheduled: true,
      timezone: timezone,
    }
  );
};

const cronExpression1 = '0 10 */1 * *'; // Her gün saat 10:00'da, her günde bir
const cronExpression2 = '30 17 */1 * *'; // Her gün saat 17:30'da, her  günde bir
const targetURL = 'http://localhost:3030/admin/send-message';

sendReminder(cronExpression1, targetURL, turkeyTimezone);
sendReminder(cronExpression2, targetURL, turkeyTimezone);

mongoose
  .connect('yourdbinfo')
  .then(() => {
    app.listen(4040);
  })
  .catch((err) => {
    console.log(err);
  });
