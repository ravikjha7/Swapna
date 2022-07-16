const Mongoose = require('mongoose');
const { Schema } = Mongoose;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Review = Mongoose.model('Review', reviewSchema);
module.exports = Review;