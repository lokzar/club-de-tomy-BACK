const {
  Schema,
  model
} = require("mongoose");


const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    require: true
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "https://pngset.com/images/icono-de-mi-cuenta-clipart-download-default-profile-picture-footprint-transparent-png-306148.png"
  },
  profile: {
    type: String,
    enum: ["admin", "doctor", "reception", "member"],
    default: "member",
  },
  badge:[{
    type:Schema.Types.ObjectId,
    ref:"Badge"
  }],
  purchase:[{
    type:Schema.Types.ObjectId,
    ref:"Purchase"
  }]

}, {
  timestamps: true,
});

const User = model("User", userSchema);

module.exports = User;