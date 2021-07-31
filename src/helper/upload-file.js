const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/uploads/'));
  },
  filename(req, file, cb) {
      let fileName = file.originalname.split('.');
      file.name = `${fileName[0]}_${new Date().getTime()}.${fileName[1]}`;
      cb(null, `${fileName[0]}_${new Date().getTime()}.${fileName[1]}`)
  }
})

const upload = multer({ storage: storage });

module.exports = { upload }