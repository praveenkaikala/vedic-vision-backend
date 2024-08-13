// userRoutes.js
const express = require('express');
const { loginController, registerController, fetchAllUserController } = require('../controllers/userController');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const multer  = require('multer')
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../upload/'));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })

router.post('/login', loginController);
router.post('/register', upload.single('photo'), registerController); // Use upload.single('photo') for file uploads
router.get('/fetchuser', protect, fetchAllUserController);

module.exports = router;
