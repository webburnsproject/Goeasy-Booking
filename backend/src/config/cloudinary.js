const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure cloudinary with environment variable or explicit parts
if (process.env.CLOUDINARY_URL) {
  try {
    cloudinary.config();
  } catch (err) {
    console.warn('[Cloudinary Config Error]:', err.message);
  }
}

// Local upload fallback directory
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Upload buffer to Cloudinary with local disk fallback
 * @param {Buffer} buffer - File buffer from Multer
 * @param {string} folder - Destination folder (e.g. 'goeasy/documents', 'goeasy/vehicles')
 * @param {string} originalName - Original filename for fallback extension
 * @returns {Promise<{url: string, public_id: string, resource_type: string}>}
 */
const uploadToCloudinary = async (buffer, folder = 'goeasy', originalName = 'file.jpg') => {
  return new Promise((resolve, reject) => {
    // Attempt Cloudinary upload first
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (!error && result && result.secure_url) {
          return resolve({
            url: result.secure_url,
            public_id: result.public_id,
            resource_type: result.resource_type || 'image',
          });
        }

        // If Cloudinary fails (e.g. network/quota/rate limit), fallback to local storage
        console.warn(`[Cloudinary Warning]: Falling back to local storage (${error ? error.message : 'No URL returned'}).`);
        try {
          const ext = path.extname(originalName) || '.jpg';
          const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          const localPath = path.join(uploadDir, filename);
          fs.writeFileSync(localPath, buffer);

          const localUrl = `/uploads/${filename}`;
          return resolve({
            url: localUrl,
            public_id: `local_${filename}`,
            resource_type: 'local',
          });
        } catch (localErr) {
          return reject(localErr);
        }
      }
    );

    uploadStream.end(buffer);
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
};
