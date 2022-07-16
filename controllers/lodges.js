const Lodge = require('./../models/lodge');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('./../cloudinary');

module.exports.index = async (req, res) => {
    const lodges = await Lodge.find({});
    res.render('lodges/index', { lodges });
};

module.exports.renderNewForm = (req, res) => {
    res.render('lodges/new');
};

module.exports.createLodge = async (req, res, next) => {

    const geoData = await geocoder.forwardGeocode({
        query: req.body.lodge.location,
        limit: 1
    }).send();

    const lodge = new Lodge(req.body.lodge);

    lodge.geometry = geoData.body.features[0].geometry;
    lodge.images = req.files.map(f => ({ url: f.path, filename: f.filename }));

    lodge.author = req.user.id;

    await lodge.save();

    console.log(lodge);

    req.flash('success', 'Lodge Added SuccessFully !!!');

    res.redirect(`/lodges/${lodge._id}`);
};

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const lodge = await Lodge.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!lodge) {
        req.flash('error', 'Cannot Find That Lodge !!!');
        return res.redirect('/lodges');
    }

    res.render('lodges/show', { lodge });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const lodge = await Lodge.findById(id);

    if (!lodge) {
        req.flash('error', 'Cannot Find That Lodge !!!');
        return res.redirect('/lodges');
    }

    res.render('lodges/edit', { lodge });
};

module.exports.updateLodge = async (req, res) => {
    const { id } = req.params;

    const lodge = await Lodge.findByIdAndUpdate(id, { ...req.body.lodge });

    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));

    lodge.images.push(...imgs);
    await lodge.save();

    if (req.body.deleteImages) {

        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }

        await lodge.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }

    req.flash('success', 'Lodge Updated SuccessFully !!!');

    res.redirect(`/lodges/${lodge._id}`);
};


module.exports.deleteLodge = async (req, res) => {
    const { id } = req.params;
    const lodge = await Lodge.findByIdAndDelete(id);

    req.flash('success', 'Lodge Deleted SuccessFully !!!');

    res.redirect('/lodges');
};