/* ===== REQUIRED DEPENDENCIES ===== */
// Express.js - Web framework for Node.js
const express = require('express');
// Multer - Middleware for handling multipart/form-data (file uploads)
const multer = require('multer');
// CSV-parser - Library for parsing CSV files
const csv = require('csv-parser');
// File system operations
const fs = require('fs');
// Path utilities for working with file and directory paths
const path = require('path');
// session set up
const session = require('express-session');

/* ===== SERVER CONFIGURATION ===== */

// Create Express application instance
const app = express();
// Define the port number for the server
const port = 3000;

/* ===== MIDDLEWARE CONFIGURATION ===== */

// Configure multer for file uploads
// Files will be temporarily stored in the 'uploads/' directory
const upload = multer({ dest: 'uploads/' });

// Serve static files from the 'public' directory
// This allows the browser to access HTML, CSS, and JS files
app.use(express.static('public'));

//bootstrap
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));

/* ===== SESSION SETUP ===== */
app.use(session({
  secret: 'SMAFkey2249', // unique secret for signing the session ID cookie
  resave: false,             // Forces the session to be saved back to the session store, even if not modified
  saveUninitialized: false,  // Forces a session that is "uninitialized" to be saved to the store
  cookie: { secure: process.env.NODE_ENV === 'production' } // Set secure: true in production for HTTPS
}));

/* ===== DIRECTORY SETUP ===== */

// Ensure uploads directory exists
// Create the directory if it doesn't exist to prevent errors during file upload
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

/* ===== ROUTE HANDLERS ===== */

/**
 * Route to serve the main page
 * When users navigate to the root URL (/), serve the HTML file
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * Route to handle CSV file upload and processing
 * Accepts POST requests with CSV files and processes them
 */
app.post('/upload', upload.single('csvFile'), (req, res) => {
  // Check if a file was actually uploaded
  if (!req.file) {
    return res.json({ success: false, error: 'No file uploaded' });
  }

  // Initialize array to store CSV data and get original filename
  const results = [];
  const fileName = req.file.originalname;
  
  console.log(`Processing CSV file: ${fileName}`);

  // Create a readable stream from the uploaded file and pipe it through CSV parser
  fs.createReadStream(req.file.path)
    .pipe(csv())  // Parse CSV format
    .on('data', (data) => {
      // Event fired for each row of data parsed from CSV
      results.push(data);  // Add row to results array
    })
    .on('end', () => {
      // Event fired when entire file has been processed
      console.log('CSV file successfully processed');
      console.log(`Total rows: ${results.length}`);
      
      // Clean up uploaded file from server storage
      fs.unlinkSync(req.file.path);
      
      // Send successful response with processed data
      res.json({
        success: true,
        fileName: fileName,
        totalRows: results.length,
        sampleData: results
      });
    })
    .on('error', (error) => {
      // Event fired if there's an error processing the file
      console.error('Error reading CSV file:', error);
      
      // Clean up uploaded file even if processing failed
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      // Send error response
      res.json({ success: false, error: 'Error processing CSV file' });
    });
});

/* ===== SERVER STARTUP ===== */

/**
 * Start the server
 */
app.listen(port, () => {
  
});