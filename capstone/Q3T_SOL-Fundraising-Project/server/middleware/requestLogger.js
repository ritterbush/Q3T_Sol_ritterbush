// middleware/requestLogger.js
const fs = require('fs');
const path = require('path');

// Log request details to a file
const logRequestToFile = (log) => {
    const logFilePath = path.join(__dirname, '../logs/requestLogs.txt');

    // Append the log to the log file
    fs.appendFileSync(logFilePath, `${log}\n`, (err) => {
        if (err) console.error('Failed to write to log file:', err);
    });
};

const requestLogger = (req, res, next) => {
    const currentTime = new Date().toISOString();
    const log = `[${currentTime}] ${req.method} ${req.originalUrl} - ${req.ip}`;

    // Store the log in a file
    logRequestToFile(log);

    console.log(log); // Optional: Log to console for debugging purposes

    next(); // Proceed to the next middleware or route handler
};

module.exports = requestLogger;
