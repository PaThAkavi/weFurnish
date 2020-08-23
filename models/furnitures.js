var mongoose = require("mongoose");

var wefurnishSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String
}); 

module.exports = mongoose.model("Furniture", wefurnishSchema);