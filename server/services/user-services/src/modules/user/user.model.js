import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },


    fullname: {
      type: String,
      trim: true,
      lowercase: true,
      required : true
  
    },

    password: {
      type: String,
      required : true
    
    },

    profileImage: {
      type: String,
      default: "https://static.vecteezy.com/system/resources/previews/013/042/571/large_2x/default-avatar-profile-icon-social-media-user-photo-in-flat-style-vector.jpg",
    },

    role: {
      type: String,
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model("User", userSchema);
export default User
