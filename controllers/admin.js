const Domain = require('../models/domain');
const Log = require('../models/log');
const moment = require('moment');
const webhook = require('webhook-discord');

exports.getIndex = (req, res, next) => {
  res.render('main/index', { pageTitle: 'Set Your Remainder!', path: req.url });
};

// GET -> '/domains'
exports.getDomains = (req, res, next) => {
  Domain.find()
    .then((domains) => {
      res.render('domain-remainder/index', {
        pageTitle: 'Domain Remainder',
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
        return res.render('domain-remainder/index', {
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
      return res.status(204).end();
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.sendMessage = (req, res, next) => {
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

      const DISCORD_WEBHOOKHEADER = 'Domain Remainder';
      const DISCORD_WEBHOOKURL = 'yourDCurl';

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
