const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadToCloudinary } = require('../config/cloudinary');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/', authenticate, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const folder = req.body.folder || 'goeasy';
    const result = await uploadToCloudinary(req.file.buffer, folder, req.file.originalname);

    res.json({
      success: true,
      url: result.url,
      public_id: result.public_id,
      resource_type: result.resource_type,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
