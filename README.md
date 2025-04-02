## Repository for CCAPDEV MCO (Phase 1 to 3)

### **MCO Phase 1**

- **js/profile1-data.js**: Contains multiple profiles. Modify the comments to test different profiles.
- **index.html**: Load this file to start the app.
- **/resources**: Folder containing resource files like images, fonts, etc.
- **/templates**: Folder with template files for specific sections and items.

### **MCO Phase 2**

For **Phase 2**, the application is built using Node.js and Express. Below are the key components:

- **app.js**: The entry point for the application. To start the app, run:
  ```bash
  node app.js
  ```
- alternatively, you can access the deployed app here: https://connectify-y0tq.onrender.com 

- **/controllers**: Contains functions that are called by the routes defined in the application.
- **/routes**: Includes route definitions that map HTTP requests to the corresponding controller functions.
- **/models**: Contains the Mongoose schema definitions, such as Users, Posts, Likes, etc.
- **/views**: Folder for Handlebars (`hbs`) files used for rendering the frontend templates.
- **/public**: Contains static assets like CSS, JavaScript, resources, and uploaded files.

#### **Installation**

Before starting the application, ensure you have Node.js and npm installed. To install the required dependencies, run the following command:

```bash
npm install express morgan mongoose hbs moment body-parser express-fileupload bcrypt express-session cookie-parser
```

This will install the following packages:

- **express**: A web framework for Node.js.
- **morgan**: HTTP request logger middleware for Node.js.
- **mongoose**: MongoDB object modeling tool designed to work in an asynchronous environment.
- **hbs**: Handlebars templating engine for rendering dynamic HTML.
- **moment**: A library for parsing, validating, manipulating, and formatting dates.
- **body-parser**: Middleware for parsing incoming request bodies.
- **express-fileupload**: Middleware to handle file uploads.
- **bcrypt**: A library for hashing and comparing passwords securely.
- **express-session**: Middleware for managing user sessions with a unique session ID.
- **cookie-parser**: Middleware for parsing cookies attached to incoming requests.

#### **Log In**
- please use these details if you wish to log in:
  - username: AkoSiDarna
  - password: Narda!85

### **Submitted By:**
- **CHUA, Hanielle**
- **KELSEY, Gabrielle**
- **SANTOS, Francine**
- **TOLENTINO, Hephzi**
