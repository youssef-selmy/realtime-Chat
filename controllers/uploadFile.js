const multer = require('multer');
const User=require('../models/userModel')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage }).single('file');

const uploadFile = (req, res) => {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).send(err.message);
      } else if (err) {
        return res.status(500).send(err);
      }
  
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
  
     
      const userId = req.user.id; 
  
      try {
        
        const user = await User.findById(userId);
  
        if (!user) {
          return res.status(404).send('User not found.');
        }
  
        
        user.fileLink = `/uploads/${req.file.filename}`;
        await user.save();
  
        
        res.status(200).json({msg:'File uploaded and linked to the user!',filelink:user.fileLink});
      } catch (error) {
        res.status(500).send('Error linking file to the user.');
      }
    });
  };

module.exports = { uploadFile };
