import mongoose from "mongoose";

const mechanicSchema = new mongoose.Schema(
  {

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    fullname: {
      type: String,
      trim: true,
      lowercase : true,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      default: "mechanic",
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },

    address: {
      type: String,
      trim : true
    },

    profileImage: {
      type: String,
      default: "https://static.vecteezy.com/system/resources/previews/013/042/571/large_2x/default-avatar-profile-icon-social-media-user-photo-in-flat-style-vector.jpg",
    },

    documents: {
      citizenshipFront: String,
      citizenshipBack: String,
      panNumber: String,
      vatNumber: String
    },

    rating: {
      type: Number,
      default: 0
    },

    totalReviews: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    isVerified: {
      type: Boolean,
      default: false
    }

  },
  { timestamps: true }
);

mechanicSchema.pre("save", async function () {
  this.isVerified = this.status === "approved";
});

const mechanic = mongoose.model("mechanic", mechanicSchema);

export default mechanic;