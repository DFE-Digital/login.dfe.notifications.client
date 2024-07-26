# login.dfe.notifications.client

[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

Client for sending user notifications within DfE Login

## Usage

Create an instance of the NotificationClient, passing the connection string for the service

```
const NotificatonClient = require('login.dfe.notifications.client');
const client = new NotificatonClient({
  connectionString: '[CONNECTION-STRING-PROVIDED]'
});
```

The client then has methods for sending notifications. All methods return promises.

## Notifications

### Password reset

Send a notification when a password reset is requests

```
await client.sendPasswordReset(email, code, clientId);
```

- `email` the email address of the user receiving the notification
- `code` the reset code the assigned to the user of the reset
- `clientId` the clientId of the application where the user came from

### Invitation

Send an invitation to a user about a service

```
await client.sendInvitation(email, firstName, lastName, serviceName, serviceNameWelcomeMessage, 
        serviceNameWelcomeMessageDescription);
```

- `email` the email address of the user receiving the notification
- `firstName` first name of the recipient 
- `lastName` last name of the recipient
- `serviceName` name of the service they are invited to
- `serviceNameWelcomeMessage` paragraph of email introducing to service they are invited to
- `serviceNameWelcomeMessageDescription` paragraph of email giving a description of the service 

## Running locally

Install dependencies
```
npm i
```

Run relevant test script, for example:

```
node tools/sendPasswordReset.js
node tools/sendInvitation.js
```

By default, the test scripts are configured to use your local machine. If you want to use them against another connection, edit ./tools/config.json
