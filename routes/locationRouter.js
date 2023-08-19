const locationRouter = require('express').Router();
const locationController = require('../controllers/locationController');
// const path = require('path');
// const multer = require('multer');
// // Configure multer to handle file uploads
// const storage = multer.diskStorage({
//     destination: './client/images/destination',
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//       const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
//       locationController.updateLocationData(fileName); // Save the filename to the database
//       cb(null, fileName);
//     }
//   });
  
//   const upload = multer({ storage: storage });

locationRouter.get('/:partial_string',locationController.getPartialMatch);
locationRouter.get('/',(req,res)=>res.send("in locations router"))
locationRouter.post('/',locationController.createLocation);
locationRouter.post('/uploadimage'/*,upload.single('image')*/,locationController.uploadImageToServer);

module.exports = locationRouter;