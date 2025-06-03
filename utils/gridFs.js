const multer = require("multer");

// Use in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
