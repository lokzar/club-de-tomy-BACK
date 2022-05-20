const {
    Schema,
    model
} = require("mongoose");

const badgeSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://pngset.com/images/icono-de-mi-cuenta-clipart-download-default-profile-picture-footprint-transparent-png-306148.png"
    },
    value: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true,
});



const Badge = model("Badge", badgeSchema);

module.exports = Badge;