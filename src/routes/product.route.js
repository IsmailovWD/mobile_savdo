const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const joiMiddleware = require('../middleware/joi.middleware');
const {productScheme} = require('../middleware/validators/productValidator.middleware')
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
      cb(null, './uploads/');
  },
  filename: function(req, file, cb){
      req.body.img = new Date().toISOString().replace(/:/g, '-') + path.extname(file.originalname);
      cb(null, req.body.img);
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png'){
      cb(null, true);
  }else{
      cb(null, false);
      //return cb(new Error('Only images are allowed'))
  }
}

let upload = multer({
  storage: storage,
  limits:{
      fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
}).single('img');

router.get('/', auth(), awaitHandlerFactory(ProductController.getAll));
router.get('/residual', auth(), awaitHandlerFactory(ProductController.getAll_ostatok));
router.post('/', auth(Role.Admin,Role.Programmer), upload, joiMiddleware(productScheme.create), awaitHandlerFactory(ProductController.create));
router.patch('/id/:id', auth(Role.Admin,Role.Programmer), upload, joiMiddleware(productScheme.update), awaitHandlerFactory(ProductController.update));
router.get('/id/:id', auth(Role.Admin,Role.Programmer), awaitHandlerFactory(ProductController.getById))
router.get('/auto-increment-id', auth(), awaitHandlerFactory(ProductController.getAutoIncrementId));
module.exports = router;