const mongoose = require('mongoose');
const express = require('express');

const path = require('path');
const bodyParser = require('body-parser');

const reminderHandler = require('./util/send-reminder');

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

//Remainders For Domains
const cronExpression1 = '0 10 */1 * *'; // Her gün saat 10:00'da, her günde bir
const cronExpression2 = '30 17 */1 * *'; // Her gün saat 17:30'da, her  günde bir

reminderHandler.sendReminder(
  'domainMorningReminder',
  cronExpression1,
  'domain'
);
reminderHandler.sendReminder(
  'domainEveningReminder',
  cronExpression2,
  'domain'
);

mongoose
  .connect('yourdb')
  .then(() => {
    app.listen(4040);
  })
  .catch((err) => {
    console.log(err);
  });
