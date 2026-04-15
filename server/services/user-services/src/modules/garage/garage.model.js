import mongoose from "mongoose";

const garageSchema = new mongoose.Schema(
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

    ownerName: {
      type: String,
      trim: true
    },

    role: {
      type: String,
      default: "garage",
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      // sparse: true
    },

    address: {
      type: String,
      trim : true
    },

    city: String,

    description: String,

    location: {
      type: {
        type: String,
        enum: ["Point"]
      },
      coordinates: {
        type: [Number]
      }
    },

    profileImage: {
      type: String,
      default: "https://static.vecteezy.com/system/resources/previews/013/042/571/large_2x/default-avatar-profile-icon-social-media-user-photo-in-flat-style-vector.jpg",
    },

    shopImages: [String],

    services: [String],

    openingTime: String,
    closingTime: String,

    isOpen24Hours: {
      type: Boolean,
      default: false
    },

    documents: {
      registrationCertificate: String,
      citizenshipFront: String,
      citizenshipBack: String,
      panNumber: String,
      vatNumber: String
    },

    paymentDetails: {
      bankName: String,
      accountHolderName: String,
      accountNumber: String,
      branch: String,
      esewaId: String,
      khaltiId: String
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

garageSchema.index({ location: "2dsphere" });

garageSchema.pre("save", async function () {
  this.isVerified = this.status === "approved";
});

const Garage = mongoose.model("Garage", garageSchema);

export default Garage;