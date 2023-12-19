const Domain = require('../models/domain');
const Reminder = require('../models/reminder');
const Log = require('../models/log');
const reminderHandler = require('../util/send-reminder');

const webhook = require('webhook-discord');

exports.getIndex = (req, res, next) => {
  res.render('main/index', { pageTitle: 'Set Your reminder!', path: req.url });
};

// GET -> '/reminders'
exports.getReminders = (req, res, next) => {
  Reminder.find()
    .then((reminders) => {
      res.render('reminders/index', {
        pageTitle: 'reminders',
        reminders: reminders,
        editing: false,
        path: req.url,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// POST -> '/reminders'
exports.postReminder = (req, res, next) => {
  const title = req.body.title;
  const minute = req.body.minute;
  const hour = req.body.hour;
  const dayOfMonth = req.body.dayOfMonth;
  const month = req.body.month;
  const dayOfWeek = req.body.dayOfWeek;

  const reminder = new Reminder({
    title: title,
    minute: minute,
    hour: hour,
    dayOfMonth: dayOfMonth,
    month: month,
    dayOfWeek: dayOfWeek,
  });

  reminder
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).redirect('/reminders');
    })
    .catch((err) => {
      console.log(err);
    });

  const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  reminderHandler.sendReminder(reminder._id, cronExpression, 'task');
};

// GET -> '/edit-domain/:ID'
exports.getEditReminder = (req, res, next) => {
  const ID = req.params.ID;
  Reminder.findById(ID)
    .then((reminder) => {
      Reminder.find().then((reminders) => {
        return res.render('reminders/index', {
          pageTitle: 'Edit Reminder',
          selectedReminder: reminder,
          reminders: reminders,
          editing: true,
          path: req.url,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// POST -> '/edit-reminder/:ID'
exports.postEditReminder = (req, res, next) => {
  const ID = req.params.ID;
  const title = req.body.title;
  const minute = req.body.minute;
  const hour = req.body.hour;
  const dayOfMonth = req.body.dayOfMonth;
  const month = req.body.month;
  const dayOfWeek = req.body.dayOfWeek;

  Reminder.findById(ID)
    .then((reminder) => {
      reminder.title = title;
      reminder.minute = minute;
      reminder.hour = hour;
      reminder.dayOfMonth = dayOfMonth;
      reminder.month = month;
      reminder.dayOfWeek = dayOfWeek;

      return reminder.save();
    })
    .then(() => {
      reminderHandler.cancelTask(ID);
      const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
      reminderHandler.sendReminder(ID, cronExpression, 'task');
      res.redirect('/reminders');
    })
    .catch((error) => {
      console.error('Update failed:', error);
    });
};

// POST -> '/reminders/:ID'
exports.deleteReminder = (req, res, next) => {
  const ID = req.params.ID;
  Reminder.findByIdAndDelete(ID)
    .then(() => {
      console.log(req.url);
      reminderHandler.cancelTask(ID);
      return res.redirect('/reminders');
    })
    .catch((err) => {
      console.log(err);
    });
};

// --------------------

// GET -> '/domains'
exports.getDomains = (req, res, next) => {
  Domain.find()
    .then((domains) => {
      res.render('domain-reminder/index', {
        pageTitle: 'Domain reminder',
        path: req.url,
        editing: false,
        domains: domains,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// POST -> '/domains'
exports.postAddDomain = (req, res, next) => {
  const domainName = req.body.domain_name;
  const purchaseDate = req.body.purchase_date;
  const expirationDate = req.body.expiration_date;
  const activity = req.body.activity;

  const domain = new Domain({
    domain_name: domainName,
    purchase_date: purchaseDate,
    expiration_date: expirationDate,
    activity: activity,
  });

  domain
    .save()
    .then((result) => {
      Domain.find().then((domains) => {
        res.status(201).redirect('/domains');
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// GET -> '/edit-domain/:ID'
exports.getEditDomain = (req, res, next) => {
  const ID = req.params.ID;
  Domain.findById(ID)
    .then((domain) => {
      Domain.find().then((domains) => {
        return res.render('domain-reminder/index', {
          pageTitle: 'Edit Domain',
          path: req.url,
          editing: true,
          selectedDomain: domain,
          domains: domains,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// POST -> '/edit-domain/:ID'
exports.postEditDomain = (req, res, next) => {
  const ID = req.params.ID;
  const domainName = req.body.domain_name;
  const purchaseDate = req.body.purchase_date;
  const expirationDate = req.body.expiration_date;
  const activity = req.body.activity;

  Domain.findById(ID)
    .then((domain) => {
      domain.domain_name = domainName;
      domain.purchase_date = purchaseDate;
      domain.expiration_date = expirationDate;
      domain.activity = activity;

      return domain.save();
    })
    .then(() => {
      res.redirect('/domains');
    })
    .catch((error) => {
      console.error('Update failed:', error);
    });
};

// POST -> '/domains/:ID'
exports.deleteDomain = (req, res, next) => {
  const ID = req.params.ID;
  Domain.findByIdAndDelete(ID)
    .then(() => {
      console.log(req.url);
      return res.redirect('/domains');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.remindTask = (req, res, next) => {
  Reminder.findById(req.params.ID)
    .then((reminder) => {
      const DISCORD_WEBHOOKHEADER = 'Task Reminder';
      const DISCORD_WEBHOOKURL = '';

      async function sendDiscord(message) {
        try {
          const Hook = new webhook.Webhook(DISCORD_WEBHOOKURL);
          await Hook.info(DISCORD_WEBHOOKHEADER, message);
        } catch (error) {
          console.error('Error sending Discord message:', error);
        }

        Reminder.findByIdAndDelete(req.params.ID)
          .then((result) => {
            console.log('sent then deleted');
            res.redirect('/reminders');
          })
          .catch((err) => {
            console.log(err);
          });
      }

      let messageText = reminder.title;
      messageText = `
      ------------------------
      ${messageText}
      ------------------------
      `;

      // save log then redirect

      const clientIP = req.ip;
      const httpStatusCode = res.statusCode;
      const receivers = ['kaanozer35@gmail.com'];
      const currentDate = new Date();
      res.data = messageText;

      const log = new Log({
        IP: clientIP,
        response: messageText,
        receivers: receivers,
        http_status: httpStatusCode,
        date: currentDate,
      });

      log
        .save()
        .then((result) => {
          sendDiscord(messageText);
          console.log(res.data);
          return res.status(200);
        })
        .catch((err) => {
          console.error('Error saving log:', err);
        });
    })
    .catch((err) => {
      console.error('Error fetching domains:', err);
    });
};

exports.remindDomain = (req, res, next) => {
  Domain.find()
    .then((domains) => {
      let messageText = '';
      let formattedString = '';
      let domainCounter = 0;

      domains.forEach((domain, index) => {
        const currentDate = new Date();
        const expirationDate = new Date(domain.expiration_date);
        const timeDifference = expirationDate - currentDate;
        const diffDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        purschase_date_arr = domain.purchase_date.toString().split(' ');
        expiration_date_arr = domain.expiration_date.toString().split(' ');

        if (diffDays <= 3) {
          domainCounter++;

          console.log(domainCounter);
          if (domainCounter === 1) {
            formattedString += `
            ------------------------
            `;
          }
          formattedString += `
            Domain Name: ${domain.domain_name}
            Purchase Date: ${
              purschase_date_arr[0] +
              ' ' +
              purschase_date_arr[1] +
              ' ' +
              purschase_date_arr[2]
            }
            Expiration Date: ${
              expiration_date_arr[0] +
              ' ' +
              expiration_date_arr[1] +
              ' ' +
              expiration_date_arr[2]
            }
            Remaining Days: ${diffDays}
            Activity Status: ${domain.activity} 
          `;

          formattedString += `
            ------------------------
          `;

          messageText += formattedString;
        }

        if (domainCounter === 0) {
          messageText = `
          ------------------------
          There is no need to purchase domain within 3 days...
          ------------------------
          `;
        }
      });

      const clientIP = req.ip;
      const httpStatusCode = res.statusCode;
      const receivers = ['kaanozer35@gmail.com'];
      const currentDate = new Date();
      res.data = messageText;

      const log = new Log({
        IP: clientIP,
        response: messageText,
        receivers: receivers,
        http_status: httpStatusCode,
        date: currentDate,
      });

      const DISCORD_WEBHOOKHEADER = 'Domain Reminder';
      const DISCORD_WEBHOOKURL = '';

      async function sendDiscord(message) {
        try {
          const Hook = new webhook.Webhook(DISCORD_WEBHOOKURL);
          await Hook.info(DISCORD_WEBHOOKHEADER, message);
        } catch (error) {
          console.error('Error sending Discord message:', error);
        }
      }

      log
        .save()
        .then((result) => {
          sendDiscord(messageText);
          console.log(res.data);

          return res
            .status(400)
            .render('404', { pageTitle: 'Page Not Found', path: req.url });
        })
        .catch((err) => {
          console.error('Error saving log:', err);
        });
    })
    .catch((err) => {
      console.error('Error fetching domains:', err);
    });
};

//api
exports.getDomainList = (req, res, next) => {
  Domain.find()
    .then((domains) => {
      res.data = domains;
      return res.status(200).json({ status: 200, domainList: domains });
    })
    .catch((err) => {
      console.log(err);
    });
};
