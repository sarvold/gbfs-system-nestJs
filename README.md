# GBFS System NestJS API

This is a backend service built with NestJS and MongoDB for handling General Bikeshare Feed Specification (GBFS) data. This API serves as a BFF providing access to GBFS system data and exposing:

- Regarding `auto-discovery`: one main endpoint for retrieving full system details, and an auxiliary endpoint for the auto-discovery file 
- Regarding `gbfs-system`: an endpoint for creating a list of systems, which can be helpful for creating all the elements from the systems.csv file at one, with validation on `systemId` uniqueness, which is a requirement as per documentation. This adds value to ensure no duplicates in a quick and flexible manner.


## Modules

### GBFS System Module

This module is responsible for managing GBFS systems. It provides a POST endpoint for creating a list of systems, which can be helpful for creating all the elements from the systems.csv file at once. The module ensures `systemId` uniqueness, which is a requirement as per GBFS documentation.

### Auto Discovery Module

This module provides endpoints for retrieving full system details and the auto-discovery file for a given system.

## Best Practices

The application follows several best practices:

- **Modular Structure**: The application is divided into modules, each with its own responsibility. This makes the code easier to maintain and test.
- **Validation**: The application uses NestJS's built-in ValidationPipe to validate incoming client payloads.
- **Error Handling**: The application uses global exception filters for error handling. If an error occurs, the API will return a response with the appropriate HTTP status code and a message describing the error.
- **Caching**: The `/auto-discovery/:systemId` endpoint uses a custom caching interceptor to improve performance. The cache is refreshed every 10 minutes.
- **Testing**: Unit tests are provided for all services and controllers.

## Features

### POST /gbfs-system

This endpoint allows you to save a list of GBFS systems to MongoDB. The systems should be provided in the request body as an array of `GBFSSystemDto` objects.

**Request Body:**

- An array of `GBFSSystemDto` objects.

**Response:**

- An array of the created `GBFSSystemDto` objects.

**Example:**


```bash
curl -X POST 'http://localhost:3000/gbfs-system' \
-H 'Content-Type: application/json' \
-d '[
  {
    "systemId": "example1",
    "language": "en",
    "name": "Example GBFS System 1",
    "autoDiscoveryUrl": "http://example.com/gbfs.json"
  },
  {
    "systemId": "example2",
    "language": "en",
    "name": "Example GBFS System 2",
    "autoDiscoveryUrl": "http://example2.com/gbfs.json"
  }
]'
```

### GET /gbfs-system

This endpoint fetches the list of GBFS systems from MongoDB.

**Response:**

- An array of GBFSSystemDto objects.

**Example:**

```bash
curl -X GET 'http://localhost:3000/gbfs-system'
```

### GET /auto-discovery/:systemId/discovery-file

This endpoint returns the GBFS auto-discovery file for a given system.

**Parameters:**

- `systemId` (required): The ID of the GBFS system.

**Response:**

A `BaseResponse` object containing the `GbfsDiscoveryFile` for the specified system.

**Example:**

```bash
curl -X GET 'http://localhost:3000/auto-discovery/<systemId>/discovery-file'
```

### GET /auto-discovery/:systemId

This endpoint returns full details of a given GBFS system.

**Parameters:**

- `systemId` (required): The ID of the GBFS system.

**Response:**

A `FullSystemDetails` object containing detailed information about the specified system.

**Example:**

```bash
curl -X GET 'http://localhost:3000/auto-discovery/<systemId>'
```

### GET /auto-discovery/:systemId/discovery-file

This endpoint returns the GBFS auto-discovery file for a given system.

**Parameters:**

- `systemId` (required): The ID of the GBFS system.

**Response:**

- A `BaseResponse` object containing the `GbfsDiscoveryFile` for the specified system.

**Example:**

```bash
curl -X GET 'http://localhost:3000/auto-discovery/<systemId>/discovery-file'
```

## Caching

The `/auto-discovery/:systemId` endpoint uses a custom caching interceptor to improve performance. The cache is refreshed dynamically based on `ttl` and `last_updated` provided by the different discovered endpoints.

## Error Handling

The API uses global exception filters for error handling. If an error occurs, the API will return a response with the appropriate HTTP status code and a message describing the error.

## Setup

1. Clone the repository
1. Install dependencies with npm install
1. Create a .env file in the root of the project and add your MongoDB connection string and the Client Identifier, which will be added as a header in order to consume GBFS services:

```
CLIENT_IDENTIFIER=your_name
MONGODB_URI=your_mongodb_connection_string
```

## Running the App

1. Run `npm run start` to start the application
1. The application will be available at `http://localhost:3000`

## API Endpoints

- `POST /gbfs-system`: Save a list of GBFS systems to MongoDB. The request body should be an array of GBFS systems, each with the following structure:

```
{
  "systemId": "string",
  "countryCode": "string",
  "name": "string",
  "location": "string",
  "url": "string",
  "autoDiscoveryUrl": "string",
  "authenticationInfo": "string"
}
```

- `GET /gbfs-system`: Fetch the list of GBFS systems from MongoDB. The response will be an array of GBFS systems with the same structure as above.

## Testing

You can test the endpoints with any HTTP client like curl or Postman.
Unit tests are provided for all services and controllers. Use the npm test command to run the tests.


## Future Work

This is just the beginning of the GBFS project. The next steps will be to create a frontend app to display station information and station status for the different systems.