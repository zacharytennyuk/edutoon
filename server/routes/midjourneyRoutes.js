const express = require('express');
const router = express.Router();
const multer = require('multer');
const { generateContent } = require('../controllers/midjourneyController');

// Set up multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/create-panel-midjourney', upload.single('image'), async (req, res) => {
  try {
    const { abstract } = req.body;
    const image = req.file; // The uploaded image file

    let imageUrl = null;
    if (image) {
      // Upload the image to a suitable image hosting service and get the direct URL
      // Here you would include your own logic to upload the image and get the URL
      imageUrl = await uploadImageToHostingService(image);
    }

    const result = await generateContent(abstract, imageUrl);
    res.json(result);
  } catch (error) {
    console.error("Error from MyMidjourney:", error);
    res.status(500).send("Could not create panel.");
  }
});

module.exports = router;

// Function to upload image to hosting service (to be implemented)
const uploadImageToHostingService = async (image) => {
  // Implement your image upload logic here and return the direct image URL
  // For example, you might use an AWS S3 bucket or another image hosting service
  // Placeholder return statement
  return 'https://example.com/path/to/uploaded/image.png';
};
