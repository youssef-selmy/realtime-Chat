# realtime-Chat
### using socket.io to build a chat room between two or more user

## File Upload and User Authentication with Node.js
### using socket.io to build a chat room between two or more user
### This project demonstrates file upload functionality associated with user authentication using Node.js, Express, JWT (JSON Web Tokens), and MongoDB.

## Installation
### Clone the repository: 

## bash
### Copy code
``` git clone https://github.com/your-username/your-repo.git ```
## Install dependencies:

## bash
### Copy code
``` npm install ```
## Set up environment variables:

### Create a .env file in the root directory.
### Define the necessary environment variables such as PORT, MONGO_URI, and JWT_SECRET_KEY.
## Start the application:

## bash
### Copy code
``` npm run dev ```
## Features
### File Upload (Upload Route)
### Functionality
### Utilizes Multer to handle file uploads and store them in the uploads/ directory.
### Links the uploaded file to the logged-in user.
### The file link is stored in the user's data.
## Endpoint
### POST /file/upload: Endpoint to upload a file and link it to the logged-in user.
## User Authentication (Auth Route)
### Functionality
### Provides user signup and login functionalities.
### Uses bcrypt for password encryption and JWT for token generation/authentication.
## Endpoints
``` POST /api/auth/signup ``` 
#### Endpoint for user signup.
``` POST /api/auth/login ``` 
#### Endpoint for user login. 
``` POST /file/upload ```
#### Endpoint for upload files  for logged user.
### Protect middleware to protect routes (checks user authentication).
## Usage
### File Upload
### Use a REST client like Postman or cURL to send a POST request to /file/upload.
### Include the file as a form-data field named file.
### Make sure to include the authentication token in the request headers (JWT token received after login/signup).
## User Authentication
### Send a POST request to /api/auth/signup with name, email, and password fields in the body.
### Use the received JWT token for subsequent authenticated requests to protected routes.
## Testing
### Unit Tests
### Utilizes Jest and Supertest for unit testing of controllers and routes.
### Includes tests for file upload controller, signup controller, and login controller
