const locationDbService = require('../services/locationDbService');
const multer = require('multer');
const path = require('path');
const utils = require('../services/utils');

const { is_authorized } = utils;

// Configure multer to handle file uploads
const storage = multer.diskStorage({
    destination: './client/images/destination',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
        cb(null, fileName);
    }
});
const upload = multer({ storage: storage });
const uploadImageToServer = async (req, res) => {
    // Use the 'upload' multer middleware to handle the file upload
    upload.single('image')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: 'File upload failed.' });
      } else if (err) {
        return res.status(500).json({ error: 'An error occurred.' });
      }
  
      // Construct the URL of the uploaded image based on the server's URL and the image path
      const imageUrl = `/images/destination/${req.file.filename}`;
  
      // File is uploaded and saved. Send back the URL to the client.
      res.json({ message: 'File uploaded successfully.', imageUrl });
    });
  };
  
/* Creating locations: only admins are allowed */
const createLocation = async (req, res) => {
    if (req.cookies && req.cookies.token) {
        const authorizedFlag = await is_authorized(req.cookies.token);
        if (!authorizedFlag) {
            res.send({ error: "unauthorized user" });
        }
    }
    const { cityName, country } = req.body;
    const new_location = await locationDbService.createLocation(cityName, country);
    res.json(new_location);
    return;
};

const getPartialMatch = async (req, res) => {
    const { partial_string } = req.params;
    //console.log(partial_string);
    const auto_complete_arr = await locationDbService.returnPartialMatch(partial_string);
    if (!auto_complete_arr || auto_complete_arr == []) {
        res.json({ error: "no match" });
        return;
    }
    res.json(auto_complete_arr);
};

const updateLocationData = async (req, res) =>
    await locationDbService.updateLocation(req.body.cityName, req.body.data);

module.exports = { createLocation, getPartialMatch, updateLocationData, uploadImageToServer };