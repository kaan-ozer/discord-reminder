# domain-remainder

## Description

The application enables you to monitor the expiration dates of domains, facilitating timely renewal. Furthermore, it provides alerts on Discord, notifying users when a domain has three days or less until expiration.
These alerts are scheduled twice daily. Additionally, the application maintains a comprehensive log that includes information such as HTTP status codes, user IP addresses, request dates, responses, and more.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kaan-ozer/domain-remainder.git
   cd project
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

A mandatory requirement for the application is to establish a connection to MongoDB. Additionally, the time zone is customizable through a Node.js cron library, allowing users to set it according to their preferences.

## Screen Shots

![discordbot](https://github.com/kaan-ozer/domain-remainder/blob/main/screen-shots/Screenshot.png)
