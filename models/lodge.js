const Mongoose = require('mongoose');
const Review = require('./review');
const { Schema } = Mongoose;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')
});

const opts = { toJSON: { virtuals: true } };

const LodgeSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

LodgeSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <strong><a href="/lodges/${this.id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>
    `
});

LodgeSchema.post('findOneAndDelete', async (doc) => {
    if(doc) {
        const check = await Review.deleteMany({_id: { $in: doc.reviews}});
    }
})

const Lodge = Mongoose.model('Lodge', LodgeSchema);
module.exports = Lodge;