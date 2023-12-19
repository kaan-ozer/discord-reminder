const cron = require('node-cron');
const axios = require('axios');
const moment = require('moment-timezone');

const turkeyTimezone = 'Europe/Istanbul';

let targetURL;
const scheduledTasks = {};

const sendReminder = (ID, cronExpression, type) => {
  if (type === 'domain') {
    targetURL = 'http://localhost:4040/remind-domain';
  } else {
    targetURL = 'http://localhost:4040/remind-task/' + ID;
  }
  const task = cron.schedule(
    cronExpression,
    async () => {
      const currentTime = moment()
        .tz(turkeyTimezone)
        .format('YYYY-MM-DD HH:mm:ss');

      try {
        const response = await axios.get(targetURL);

        console.log(
          `[${currentTime}] HTTP Request Successful. Response:`,
          'successfull'
        );
      } catch (error) {
        console.log(targetURL);
        console.error(
          `[${currentTime}] Error during HTTP Request:`,
          error.message
        );
      }
    },
    {
      scheduled: true,
      timezone: turkeyTimezone,
    }
  );

  console.log('new reminder added');
  scheduledTasks[ID] = task;
  console.log(scheduledTasks);
};

const cancelTask = (ID) => {
  const task = scheduledTasks[ID];
  if (task) {
    console.log('a task cancelled');
    task.stop();
    delete scheduledTasks[ID]; // scheduledTasks nesnesinden kaldır
    console.log(`Scheduled task for reminder ${ID} cancelled.`);
  } else {
    console.log(`No scheduled task found for reminder ${ID}.`);
  }
};

module.exports = { sendReminder, cancelTask };
