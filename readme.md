# domain-reminder

## Description

The application enables you to monitor the expiration dates of domains, facilitating timely renewal. Furthermore, it provides alerts on Discord, notifying users when a domain has three days or less until expiration.

These alerts are scheduled twice daily. Additionally, the application maintains a comprehensive log that includes information such as HTTP status codes, user IP addresses, request dates, responses, and more.

Additionally, user is also allowed set custom reminders as different from domains, and set its notification date and these logs are also saved.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kaan-ozer/domain-reminder.git
   cd project
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

- Some mandatory requirements for the application:

1.  To establish a connection through Mongoose, so user needs to use its own db address.(In app.js)

2.  To establish a connection between discord and program, user has to provide his own DISCORD_WEBHOOKURL.(In admin.js)

## Usage

-- User can easily add, update, delete, get domains by clicking to the domain reminder service through welcome page. (All domains notifications send twice a day)

-- User is also allowed to create,update,delete,get custom reminders and set their dates by choosing second option through User interface. (Message text, notification date and frequency depends on user)

## Screen Shots

![discordbot](https://github.com/kaan-ozer/domain-reminder/public/img/screenshots/5.png)
![discordbot](https://github.com/kaan-ozer/domain-reminder/public/img/screenshots/1.png)
![discordbot](https://github.com/kaan-ozer/domain-reminder/public/img/screenshots/2.png)
![discordbot](https://github.com/kaan-ozer/domain-reminder/public/img/screenshots/3.png)
![discordbot](https://github.com/kaan-ozer/domain-reminder/public/img/screenshots/4.png)
