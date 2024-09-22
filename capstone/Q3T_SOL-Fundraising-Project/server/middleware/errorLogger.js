// middleware/errorLogger.js
const fs = require('fs');
const path = require('path');

// Log error details to a file
const logErrorToFile = (errorLog) => {
    const logFilePath = path.join(__dirname, '../logs/errorLogs.txt');

    // Append the error log to the log file
    fs.appendFileSync(logFilePath, `${errorLog}\n`, (err) => {
        if (err) console.error('Failed to write to log file:', err);
    });
};

// Error handling middleware
const errorLogger = (err, req, res, next) => {
    const currentTime = new Date().toISOString();

    const errorLog = `[${currentTime}] ${req.method} ${req.originalUrl} - Error: ${err.message}`;

    // Log the error to a file
    logErrorToFile(errorLog);

    console.error(errorLog); // Optional: Log to console for debugging purposes

    res.status(500).json({
        success: false,
        message: 'Server Error. Please try again later.',
    });
};

module.exports = errorLogger;
