var mongoose = require("mongoose");
var Furniture = require("./models/furnitures");
const User = require("./models/user");

var data = [
    {name: "Queen Sized Bed", price: 267, image: "images/image1.jpg"},
    {name: "Wardrobe", price: 216, image: "images/image2.jpg"},
    {name: "End Table", price: 180, image: "images/image3.jpg"},
    {name: "Dining Set", price: 300, image: "images/image4.jpg"},
    {name: "Bean Bag", price: 100, image: "images/image5.jpg"},
    {name: "Sofa", price: 210, image: "images/image6.jpg"},
    {name: "Dressing Table", price: 190, image: "images/image7.jpg"},
    {name: "Chest of Drawers", price: 200, image: "images/image8.jpg"},
    {name: "Recliner", price: 250, image: "images/image9.jpg"},
    {name: "Coffee Table", price: 188, image: "images/image10.jpg"},
    {name: "Trunks", price: 205, image: "images/image11.jpg"},
    {name: "Bar Stool", price: 120, image: "images/image12.jpg"}
]

function seedDB(){
    Furniture.remove({}, function(err){
        if(err){
            console.log(err);
        } else{
            console.log("removed furnitures!");
        }
        data.forEach(function(seed){
            Furniture.create(seed, function(err, data){
                if(err){
                    console.log(err);
                } else{
                    console.log("Added a furniture");
                }
            });
        });
    });
    // User.remove({}, function(err){
    //     if(err){
    //         console.log(err)
    //     } else{
    //         console.log("Removed users")
    //     }
    // });
}

module.exports = seedDB;