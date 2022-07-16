const express = require('express');
const router = express.Router();
const catchAsync = require('./../utils/catchAsync');
const lodges = require('./../controllers/lodges');
const { isLoggedIn, isAuthor, validateLodge } = require('./../middleware');
const multer  = require('multer')
const { storage } = require('./../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(lodges.index))
    .post(isLoggedIn, upload.array('image'), validateLodge, catchAsync(lodges.createLodge));

router.get('/new', isLoggedIn , lodges.renderNewForm);

router.route('/:id')
    .get(catchAsync(lodges.show))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateLodge, catchAsync(lodges.updateLodge))
    .delete(isLoggedIn, isAuthor, catchAsync(lodges.deleteLodge));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(lodges.renderEditForm));

module.exports = router;