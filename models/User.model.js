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
    default: "https://res.cloudinary.com/dz29bpftp/image/upload/v1653059218/Club-Tomy/userProfile_ssiijx.png"
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
  }],
  balance:{
    type:Number,
    default: 0,
  }
}, {
  timestamps: true,
});

const User = model("User", userSchema);

module.exports = User;