// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { connectDB, conn } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const errorLogger = require('./middleware/errorLogger');
const requestLogger = require('./middleware/requestLogger');
const methodOverride = require('method-override');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');
const protect = require('./middleware/authMiddleware');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
// app.use(cors());
app.use(helmet()); // Adds basic security headers
app.use(requestLogger);
app.use(cors({ origin: '*' }));
app.use(methodOverride("_method"));

let gfs;
conn.once("open", () => {
    gfs = Grid(conn.db, mongoose);
    gfs.collection("uploads");
});

const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads",
                };
                resolve(fileInfo);
            });
        });
    },
});
const upload = multer({ storage });

app.post("/file/uploads", protect, upload.single("file"), (req, res) => {
    try {
        return res.json(req.file);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

app.get("/files/image/:filename", protect, async (req, res) => {
    try {
        const filename = req.params.filename;
        const files = await gfs.files.findOne({ filename });

        if (!files) {
            return res.status(404).json("File not found");
        }

        if (files.contentType === "image/jpeg" || files.contentType === "image/png") {
            const gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
                bucketName: "uploads",
            });

            const readStream = gridfsBucket.openDownloadStream(files._id);

            // Set the appropriate content type header
            res.setHeader('Content-Type', files.contentType);

            readStream.on("error", (err) => {
                console.error("An error occurred!", err);
                res.status(500).send({ error: "An error occurred while reading the file." });
            });

            readStream.pipe(res);
        } else {
            return res.status(404).send({ error: "Not an image" });
        }
    } catch (e) {
        console.error("Server error:", e.message);
        res.status(500).send({ error: "Server error", message: e.message });
    }
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);

// Error handling middleware
app.use(errorLogger);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
