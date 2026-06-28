const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();

const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images only!'));
    }
}

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: function (req, file, cb) {
        // Log the file details for debugging
        console.log('Processing upload:', file.originalname, file.mimetype);
        // Use checkFileType to validate the file
        checkFileType(file, cb);
    },
});

router.post('/', (req, res) => {
    console.log(`[${new Date().toISOString()}] Upload request received`);
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Multer Error:', err);
            return res.status(400).json({ message: err.message || 'Upload failed' });
        }
        if (!req.file) {
            console.error('No file in request');
            return res.status(400).json({ message: 'No file uploaded' });
        }
        console.log('Upload success:', req.file.filename);
        res.json({ path: `/uploads/${req.file.filename}` });
    });
});

module.exports = router;
