const path = require('path');
const Mongoose = require('mongoose');

const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

const Lodge = require('./../models/lodge');

const connectDB = require("./../db");
require("dotenv").config();

connectDB();

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
    await Lodge.deleteMany({});
    for(let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 1500) + 1000;
        const lodge = new Lodge({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea ut quae tempora quaerat, debitis consequatur delectus alias rerum laboriosam dicta quis aliquid ducimus quidem! Necessitatibus quia quaerat quod officiis et!`,
            price,
            author: '62c6cfbd727cbd6bc98f3720',
            geometry: {
              type: "Point",
              coordinates: [
                cities[random1000].longitude, 
                cities[random1000].latitude,
              ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/ravikjha7/image/upload/v1657802905/fGPqEBbuQrGjOAYy4kBz_IMGP5626-Edit_ss3kqn.jpg',
                  filename: 'fGPqEBbuQrGjOAYy4kBz_IMGP5626-Edit_ss3kqn'
                },
                {
                  url: 'https://res.cloudinary.com/ravikjha7/image/upload/v1657802905/photo-1611002241439-e7e7810d02a7_pkccqh.jpg',
                  filename: 'photo-1611002241439-e7e7810d02a7_pkccqh'
                }
              ]
        })
        await lodge.save();
    }
}

seedDB().then(() => {
    Mongoose.connection.close();
})