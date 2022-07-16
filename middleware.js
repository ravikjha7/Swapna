const { lodgeSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Lodge = require('./models/lodge');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        // console.log(req.session.returnTo);
        req.flash('error', 'You Must Log In First !!!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateLodge = (req, res, next) => {

    const { error } = lodgeSchema.validate(req.body);

    if(error) {
        const msg = error.details.map(err => err.message).join(',');
        throw new ExpressError(msg, 400);
    } else next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;

    const lodge = await Lodge.findById(id);
    if(!lodge.author.equals(req.user.id)) {
        req.flash('error', 'You Do Not Have Permission To Do That !!!');
        return res.redirect(`/lodges/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user.id)) {
        req.flash('error', 'You Do Not Have Permission To Do That !!!');
        return res.redirect(`/lodges/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if(error) {
        const msg = error.details.map(err => err.message).join(',');
        throw new ExpressError(msg, 400);
    } else next();
}