# API endpoints

## Event

### GetAllEvents

- Path: /api/GetAllEvents
- Method: GET
- Description: Get all current and future events

Response Body:

```json
[
  {
    "PartitionKey": "202402",
    "Timestamp": "2024-02-29T20:59:36.9330387+00:00",
    "ETag": "W/\"datetime'2024-02-29T20%3A59%3A36.9330387Z'\"",
    "id": "2fe2fa43-0828-4aa8-b58f-44d93b47868c",
    "title": "Fika",
    "longDescription": "",
    "shortDescription": "gofika",
    "locationStreet": "",
    "locationCity": "Falun",
    "locationCountry": "Sverige",
    "creatorUserId": "f2ed044f-1929-4b01-a264-0850813a960c",
    "startDateTime": "2024-03-23T08:58:00Z",
    "endDateTime": "2024-03-23T22:00:00Z",
    "image": "",
    "imageAlt": ""
  },
  ...
]
```

### GetPreviousEvents.cs

- Path: /api/GetPreviousEvents
- Method: GET
- Description: Get all previous events

Response Body:

```json
[
  {
    "PartitionKey": "202402",
    "Timestamp": "2024-03-04T21:33:06.0820053+00:00",
    "ETag": "W/\"datetime'2024-03-04T21%3A33%3A06.0820053Z'\"",
    "id": "41eabbe2-fc81-4fe3-a4a1-5915f654790d",
    "title": "test tid",
    "longDescription": "",
    "shortDescription": "jhbhkb",
    "locationStreet": "",
    "locationCity": "jbbbjb",
    "locationCountry": "Sverige",
    "creatorUserId": "f2ed044f-1929-4b01-a264-0850813a960c",
    "startDateTime": "2024-02-29T15:00:00Z",
    "endDateTime": "2024-02-29T16:00:00Z",
    "image": "",
    "imageAlt": ""
  },
  ...
]
```

### GetEventByOrganizer.cs

- Path: /api/events/creator/{id}
- Method: GET
- Description: Get all events created by a specific user

Response Body:

```json
[
  {
    "PartitionKey": "202402",
    "Timestamp": "2024-02-28T18:03:47.7910637+00:00",
    "ETag": "W/\"datetime'2024-02-28T18%3A03%3A47.7910637Z'\"",
    "id": "e3021fe4-13a7-40a5-9dd6-9f900fc3ef3b",
    "title": "Mia test",
    "longDescription": "dsssjfjseedflejaslefjlsajfäl",
    "shortDescription": "Kul med färg",
    "locationStreet": "Oxtorgsgatan 12",
    "locationCity": "Södehamn",
    "locationCountry": "Sverige",
    "creatorUserId": "216a0e39-b2cf-44cd-838a-f404973d862a",
    "startDateTime": "2024-03-01T13:30:00Z",
    "endDateTime": "2024-03-01T14:30:00Z",
    "image": "bilden",
    "imageAlt": "bilden"
  },
  ...
]
```

### GetEvent.cs

- Path: /api/GetEvent/{id}
- Method: GET
- Description: Get a specific event

Response Body:

```json
{
  "PartitionKey": "202403",
  "Timestamp": "2024-03-05T14:40:19.1929939+00:00",
  "ETag": "W/\"datetime'2024-03-05T14%3A40%3A19.1929939Z'\"",
  "id": "60267815-6eac-467f-aa02-7b6e4f9222ef",
  "title": "Brädspelskväll",
  "longDescription": "Vem kommer att bli den rikaste för kvällen ?",
  "shortDescription": "Nya Finans kommer att spelas ",
  "locationStreet": "skateboda 20",
  "locationCity": "Älmhult",
  "locationCountry": "Sverige",
  "creatorUserId": "7d6c56df-326a-405e-bd02-18330a9f8052",
  "startDateTime": "2024-03-06T17:00:00Z",
  "endDateTime": "2024-03-07T19:00:00Z",
  "image": "",
  "imageAlt": ""
}
```

### CreateEvent.cs

- Path: /api/event
- Method: POST
- Description: Create a new event

Request Body:

```json
{
"title": "Shiba Inu Gathering!1!",
"longDescription": "Dog Lovers Meetup",
"shortDescription": "Join us for a fun afternoon with Shiba Inus!",
"locationStreet": "Röda vägen 2",
"locationCity": "Borlänge",
"locationCountry": "Sweden",
"creatorUserId": "f2ed044f-1929-4b01-a264-0850813a960c",
"startDateTime": "2024-01-28T19:15",
"endDateTime": "2024-01-29T21:35",
"image": "https://material.angular.io/assets/img/examples/shiba2.jpg",
"imageAlt": "Photo of a Shiba Inu"
}
```

Response Body:

```json
{
  "PartitionKey": "202403",
  "Timestamp": null,
  "ETag": null,
  "id": "67ae2568-4207-4dd2-bbd8-371a823d7e77",
  "title": "Shiba Inu Gathering!1!",
  "longDescription": "Dog Lovers Meetup",
  "shortDescription": "Join us for a fun afternoon with Shiba Inus!",
  "locationStreet": "Röda vägen 2",
  "locationCity": "Borlänge",
  "locationCountry": "Sweden",
  "creatorUserId": "f2ed044f-1929-4b01-a264-0850813a960c",
  "startDateTime": "2024-01-28T19:15:00Z",
  "endDateTime": "2024-01-29T21:35:00Z",
  "image": "https://material.angular.io/assets/img/examples/shiba2.jpg",
  "imageAlt": "Photo of a Shiba Inu"
}
```

### UpdateEvent.cs

- Path: /api/event/{id}
- Method: PUT
- Description: Update an event

Request Body:

```json
{
  "imageAlt": "Not a photo of a Shiba Inu"
}
```

Response Body:

```json
{
  "PartitionKey": "202403",
  "Timestamp": null,
  "ETag": null,
  "id": "67ae2568-4207-4dd2-bbd8-371a823d7e77",
  "title": "Shiba Inu Gathering!1!",
  "longDescription": "Dog Lovers Meetup",
  "shortDescription": "Join us for a fun afternoon with Shiba Inus!",
  "locationStreet": "Röda vägen 2",
  "locationCity": "Borlänge",
  "locationCountry": "Sweden",
  "creatorUserId": "f2ed044f-1929-4b01-a264-0850813a960c",
  "startDateTime": "2024-01-28T19:15:00Z",
  "endDateTime": "2024-01-29T21:35:00Z",
  "image": "https://material.angular.io/assets/img/examples/shiba2.jpg",
  "imageAlt": "Not a photo of a Shiba Inu"
}
```

### DeleteEvent.cs

- Path: /api/event/{id}
- Method: DELETE
- Description: Delete an event

Response Body:

```json
{
  "message": "Event with ID: <id> deleted successfully."
}
```

### GetEventRegistrations.cs

- Path: /api/event/{eventId}/registrations
- Method: GET
- Description: Get all responses for a specific event

Response Body:

```json
[
  {
    "eventId": "4c30730b-b26f-411d-a0ab-e6bf49da5921",
    "timestamp": "3/4/2024 12:10:47 PM +00:00",
    "userId": "a3072e6e-e072-4f39-884f-1865b443ebf8",
    "registrationStatus": "Kommer",
    "firstName": "Mikael",
    "lastName": "Eriksson",
    "username": "h21mieri@du.se",
    "avatar": "https://scontent-arn2-1.xx.fbcdn.net/v/t39.30808-1/242129614_1495131787531897_4917702409925170755_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=5740b7&_nc_ohc=5sRmdhLyklYAX-VB5Lx&_nc_ht=scontent-arn2-1.xx&oh=00_AfAxInBwm3u4wk8NMZtaLY1WYpX8nVAuUTDLx7LccXB5lg&oe=65ECC99F"
  },
  ...
]
```

## User

### GetUserEvents.cs

- Path: /api/users/{userId}/events
- Method: GET
- Description: Get all events that a user has responded to

Response Body:

```json
[
  {
    "PartitionKey": "202402",
    "Timestamp": "2024-03-04T21:33:06.0820053+00:00",
    "ETag": "W/\"datetime'2024-03-04T21%3A33%3A06.0820053Z'\"",
    "id": "41eabbe2-fc81-4fe3-a4a1-5915f654790d",
    "title": "test tid",
    "longDescription": "",
    "shortDescription": "jhbhkb",
    "locationStreet": "",
    "locationCity": "jbbbjb",
    "locationCountry": "Sverige",
    "creatorUserId": "f2ed044f-1929-4b01-a264-0850813a960c",
    "startDateTime": "2024-02-29T15:00:00Z",
    "endDateTime": "2024-02-29T16:00:00Z",
    "image": "",
    "imageAlt": ""
  },
  ...
]
```

### GetUserEventRegistration.cs

- Path: /api/users/{userId}/registration/{eventId}
- Method: GET
- Description: Get a specific user's registration for a specific event

Response Body:

```json
{
  "success": true,
  "data": {
    "Timestamp": "2024-03-06T10:01:17.1955484+00:00",
    "ETag": "W/\"datetime'2024-03-06T10%3A01%3A17.1955484Z'\"",
    "eventId": "66955fcf-358e-4127-9127-c9fd51aa1cb2",
    "userId": "456baed3-3fe6-4511-a62e-1a0da00fd947",
    "registrationStatus": "coming"
  }
}
```

### CreateEventRegistration.cs

- Path: /api/event/{eventId}/registrations/{userId}
- Method: PUT
- Description: Create or update a user registration for an event

Request Body:

```json
{
  "registrationStatus": "coming"
}
```

Response Body:

```json
{
  "Timestamp": null,
  "ETag": null,
  "eventId": "66955fcf-358e-4127-9127-c9fd51aa1cb2",
  "userId": "456baed3-3fe6-4511-a62e-1a0da00fd947",
  "registrationStatus": "coming"
}
```

### GetAllUsers.cs

- Path: /api/users
- Method: GET
- Description: Get all users

Response Body:

```json
[
  {
    "lastModified": "2024-03-02T10:24:48.3128786+00:00",
    "userType": "Admin",
    "id": "216a0e39-b2cf-44cd-838a-f404973d862a",
    "username": "first.last@company.com",
    "firstName": "John",
    "lastName": "Connor",
    "phoneNumber": "0701234567",
    "avatar": "<base64encodedimage>"
  },
  ...
]
```

### GetUser.cs

- Path: /api/users/{id}
- Method: GET
- Description: Get a specific user

Response Body:

```json
{
  "lastModified": "2024-03-02T10:38:46.1686949+00:00",
  "userType": "Admin",
  "id": "f2ed044f-1929-4b01-a264-0850813a960c",
  "username": "h21sebda@du.se",
  "firstName": "Sebastian",
  "lastName": "Danielsson",
  "phoneNumber": "0761345629",
  "avatar": "<base64encodedimage>"
}
```

### CreateUser.cs

- Path: /api/users
- Method: POST
- Description: Create a new user

Request Body:

```json
{
  "userType": "User",
  "username": "sam.altman@openai.com",
  "password": "gpt-4",
  "firstName": "Sam",
  "lastName": "Altman",
  "phoneNumber": "0701234567",
  "avatar": "<base64encodedimage>"
}
```

Response Body:

```json
{
  "PartitionKey": "User",
  "RowKey": "3427cc32-a87e-43af-83cf-1a56de214768",
  "UserType": "User",
  "Username": "sam.altman@openai.com",
  "FirstName": "Sam",
  "LastName": "Altman",
  "PhoneNumber": "0701234567",
  "Avatar": "<base64encodedimage>"
}
```

### UpdateUser.cs

- Path: /api/users/{id}
- Method: PUT
- Description: Update a user

Request Body:

```json
{
  "userType": "User",
  "username": "sam.altman@openai.com",
  "password": "AGI123",
  "firstName": "Sam",
  "lastName": "Altman",
  "phoneNumber": "0701234567",
  "avatar": "<base64encodedimage>"
}
```

Response Body:

```json
{
  "Timestamp": "2024-03-06T10:38:40.6117728+00:00",
  "UserType": "User",
  "RowKey": "3427cc32-a87e-43af-83cf-1a56de214768",
  "Username": "sam.altman@openai.com",
  "FirstName": "Sam",
  "LastName": "Altman",
  "PhoneNumber": "0701234567",
  "Avatar": ""
}
```

### DeleteUser.cs

- Path: /api/users/{id}
- Method: DELETE
- Description: Delete a user

Response Body:

```json
{
  "message": "User with ID: <userId> deleted successfully."
}
```

## Misc

### AuthenticationManager.cs SignIn

- Path: /api/auth/signin
- Method: POST
- Description: Sign in a user

Request Body:

```json
{
  "username": "Jeppe",
  "password": "Test"
}
```

Response Body:

```json
{
  "token": "<super-secret-2hour-token>"
}
```

### AuthenticationManager.cs ValidateToken

- Path: /api/validateToken
- Method: POST
- Description: Validate a token

Request Body:

```json
{
  "token": "<super-secret-2hour-token>"
}
```

Response Body:

```json
{
  "valid": true,
  "message": "Token is valid."
}
```

### Message.cs

- Path: /api/Message
- Method: POST
- Description: Send an email

Request Body:

```json
{
  "recipient": "h21sebda@du.se",
  "subject": "Inbjudan till event",
  "htmlContent":"<html-template>",
  "attachment": {
    "name": "<event-name>.ics",
    "contentType": "text/calendar",
    "content": "<base64-encoded-ics-file>"
  }
}
```

Response Body:

```json
{
  "message": "Email sent successfully."
}
```
