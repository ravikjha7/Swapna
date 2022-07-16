const Lodge = require('./../models/lodge');
const Review = require('./../models/review');

module.exports.createReview = async (req, res) => {

    const review = new Review(req.body.review);
    review.author = req.user.id;
    await review.save();
    const { id } = req.params;
    const lodge = await Lodge.findById(id);
    lodge.reviews.push(review);
    await lodge.save();

    req.flash('success', 'Review Added SuccessFully !!!');

    res.redirect(`/lodges/${id}`);
};

module.exports.deleteReview = async (req, res) => {

    const { id, reviewId } = req.params;
    await Lodge.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Review Deleted SuccessFully !!!');

    res.redirect(`/lodges/${id}`);

};