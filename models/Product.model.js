const {
    Schema,
    model
} = require("mongoose");

const productSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "https://pngset.com/images/icono-de-mi-cuenta-clipart-download-default-profile-picture-footprint-transparent-png-306148.png"
    },
    price: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true,
});


const Product = model("Product", productSchema);

module.exports = Product;